const SongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "songs",
  version: "1.0.0",
  register: (app, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    app.use(routes(songsHandler));
  },
};
