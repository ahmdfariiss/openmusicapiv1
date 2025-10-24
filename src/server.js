require("dotenv").config();
const express = require("express");

// Services
const AlbumsService = require("./services/postgres/AlbumsService");
const SongsService = require("./services/postgres/SongsService");

// Validators
const AlbumsValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");

// API Plugins
const albums = require("./api/albums");
const songs = require("./api/songs");

const init = async () => {
  const app = express();

  // Middleware untuk parsing JSON
  app.use(express.json());

  // Inisialisasi services
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  // Register API Routes
  albums.register(app, {
    service: albumsService,
    validator: AlbumsValidator,
  });

  songs.register(app, {
    service: songsService,
    validator: SongsValidator,
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "OpenMusic API v1.0.0",
      status: "running",
    });
  });

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      status: "fail",
      message: "Route tidak ditemukan",
    });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "Maaf, terjadi kegagalan pada server kami.",
    });
  });

  const HOST = process.env.HOST || "localhost";
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, HOST, () => {
    console.log(`Server berjalan pada http://${HOST}:${PORT}`);
  });
};

init();
