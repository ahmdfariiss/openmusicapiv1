const authMiddleware = require("../../middleware/auth");

const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    middleware: [authMiddleware],
    handler: (req, res, next) => handler.postPlaylistHandler(req, res, next),
  },
  {
    method: "GET",
    path: "/playlists",
    middleware: [authMiddleware],
    handler: (req, res, next) => handler.getPlaylistsHandler(req, res, next),
  },
  {
    method: "DELETE",
    path: "/playlists/:id",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.deletePlaylistByIdHandler(req, res, next),
  },
  {
    method: "POST",
    path: "/playlists/:id/songs",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.postSongToPlaylistHandler(req, res, next),
  },
  {
    method: "GET",
    path: "/playlists/:id/songs",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.getSongsFromPlaylistHandler(req, res, next),
  },
  {
    method: "DELETE",
    path: "/playlists/:id/songs",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.deleteSongFromPlaylistHandler(req, res, next),
  },
  {
    method: "GET",
    path: "/playlists/:id/activities",
    middleware: [authMiddleware],
    handler: (req, res, next) =>
      handler.getPlaylistActivitiesHandler(req, res, next),
  },
];

module.exports = routes;
