const express = require("express");

const routes = (handler) => {
  const router = express.Router();

  router.post("/songs", handler.postSongHandler);
  router.get("/songs", handler.getSongsHandler);
  router.get("/songs/:id", handler.getSongByIdHandler);
  router.put("/songs/:id", handler.putSongByIdHandler);
  router.delete("/songs/:id", handler.deleteSongByIdHandler);

  return router;
};

module.exports = routes;
