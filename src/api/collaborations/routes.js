const authMiddleware = require("../../middleware/auth");

const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.postCollaborationHandler(req, res, next),
  },
  {
    method: "DELETE",
    path: "/collaborations",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.deleteCollaborationHandler(req, res, next),
  },
];

module.exports = routes;
