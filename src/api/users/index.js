const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: (app, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);
    const usersRoutes = routes(usersHandler);

    usersRoutes.forEach(({ method, path, handler }) => {
      app[method.toLowerCase()](path, handler);
    });
  },
};
