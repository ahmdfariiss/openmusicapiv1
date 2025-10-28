const PlaylistsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlists",
  version: "1.0.0",
  register: (app, { playlistsService, songsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      validator
    );
    const playlistsRoutes = routes(playlistsHandler);

    playlistsRoutes.forEach(({ method, path, middleware = [], handler }) => {
      app[method.toLowerCase()](path, ...middleware, handler);
    });
  },
};
