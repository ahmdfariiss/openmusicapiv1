const express = require("express");

const routes = (handler) => {
  const router = express.Router();

  router.post("/albums", handler.postAlbumHandler);
  router.get("/albums/:id", handler.getAlbumByIdHandler);
  router.put("/albums/:id", handler.putAlbumByIdHandler);
  router.delete("/albums/:id", handler.deleteAlbumByIdHandler);

  return router;
};

module.exports = routes;
