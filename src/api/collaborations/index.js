const CollaborationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: (
    app,
    { collaborationsService, playlistsService, usersService, validator }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      usersService,
      validator
    );
    const collaborationsRoutes = routes(collaborationsHandler);

    collaborationsRoutes.forEach(({ method, path, middleware = [], handler }) => {
      app[method.toLowerCase()](path, ...middleware, handler);
    });
  },
};
