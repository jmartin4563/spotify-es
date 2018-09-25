const request = require('request-promise');

exports.handler = async (event) => {
  const tokenOptions = {
    uri: 'https://api.spotify.com/v1/browse/new-releases',
    json: true,
    headers: {
      Authorization: `Bearer ${process.env.SPOTIFY_SECRET}`
    }
  };

  const { albums } = await request.get(tokenOptions);
  albums.items.map((album) => {
    console.log(album.name);
  });
};

