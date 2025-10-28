const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: (req, res, next) =>
      handler.postAuthenticationHandler(req, res, next),
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: (req, res, next) => handler.putAuthenticationHandler(req, res, next),
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: (req, res, next) =>
      handler.deleteAuthenticationHandler(req, res, next),
  },
];

module.exports = routes;
