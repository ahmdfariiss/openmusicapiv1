const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "1.0.0",
  register: (app, { authenticationsService, usersService, validator }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      validator
    );
    const authenticationsRoutes = routes(authenticationsHandler);

    authenticationsRoutes.forEach(({ method, path, handler }) => {
      app[method.toLowerCase()](path, handler);
    });
  },
};
