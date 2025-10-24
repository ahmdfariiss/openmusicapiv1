const AlbumsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: (app, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    app.use(routes(albumsHandler));
  },
};
