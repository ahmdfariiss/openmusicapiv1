require("dotenv").config();
const express = require("express");

const ClientError = require("./exceptions/ClientError");

// Services
const AlbumsService = require("./services/postgres/AlbumsService");
const SongsService = require("./services/postgres/SongsService");
const UsersService = require("./services/postgres/UsersService");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const PlaylistsService = require("./services/postgres/PlaylistsService");

// Validators
const AlbumsValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");
const UsersValidator = require("./validator/users");
const AuthenticationsValidator = require("./validator/authentications");
const PlaylistsValidator = require("./validator/playlists");
const CollaborationsValidator = require("./validator/collaborations");

// API Plugins
const albums = require("./api/albums");
const songs = require("./api/songs");
const users = require("./api/users");
const authentications = require("./api/authentications");
const playlists = require("./api/playlists");
const collaborations = require("./api/collaborations");

const init = async () => {
  const app = express();

  // Middleware untuk parsing JSON
  app.use(express.json());

  // Inisialisasi services
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  // Register API Routes
  albums.register(app, {
    service: albumsService,
    validator: AlbumsValidator,
  });

  songs.register(app, {
    service: songsService,
    validator: SongsValidator,
  });

  users.register(app, {
    service: usersService,
    validator: UsersValidator,
  });

  authentications.register(app, {
    authenticationsService,
    usersService,
    validator: AuthenticationsValidator,
  });

  playlists.register(app, {
    playlistsService,
    songsService,
    validator: PlaylistsValidator,
  });

  collaborations.register(app, {
    collaborationsService,
    playlistsService,
    usersService,
    validator: CollaborationsValidator,
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "OpenMusic API v2.0.0",
      status: "running",
    });
  });

  // 404 Handler - harus SEBELUM error handler
  app.use((req, res) => {
    res.status(404).json({
      status: "fail",
      message: "Route tidak ditemukan",
    });
  });

  app.use((err, req, res, next) => {
    // Cek apakah error adalah ClientError (400, 404, dll)
    if (err instanceof ClientError) {
      return res.status(err.statusCode).json({
        status: "fail",
        message: err.message,
      });
    }

    // Jika bukan ClientError, maka Server Error (500)
    console.error("Server Error:", err);
    return res.status(500).json({
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
