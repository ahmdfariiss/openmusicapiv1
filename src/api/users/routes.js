const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: (req, res, next) => handler.postUserHandler(req, res, next),
  },
];

module.exports = routes;
