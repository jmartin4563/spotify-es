'use strict';

const _ = require('lodash');
const request = require('request-promise');
const elasticsearch = require('elasticsearch');
const es = new elasticsearch.Client({
  host: process.env.ES_HOST,
  httpAuth: `${process.env.ES_USER}:${process.env.ES_SECRET}`
});

exports.handler = async (event) => {
  const tokenOptions = {
    uri: 'https://api.spotify.com/v1/browse/new-releases',
    json: true,
    headers: {
      Authorization: `Bearer ${process.env.SPOTIFY_SECRET}`
    }
  };

  const { albums } = await request.get(tokenOptions);
  const uploadAlbums = _.flatten(albums.items.map((album) => {
    return [
      {
        index: {
          _index: 'spotify',
          _type : '_doc'
        }
      },
      album
    ];
  }));

  await es.bulk({ body: uploadAlbums });
};
