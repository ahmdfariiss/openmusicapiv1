class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async postPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePostPlaylistPayload(req.body);
      const { name } = req.body;
      const { userId } = req.auth;

      const playlistId = await this._playlistsService.addPlaylist({
        name,
        owner: userId,
      });

      res.status(201).json({
        status: "success",
        data: {
          playlistId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistsHandler(req, res, next) {
    try {
      const { userId } = req.auth;
      const playlists = await this._playlistsService.getPlaylists(userId);

      res.status(200).json({
        status: "success",
        data: {
          playlists,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylistByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.auth;

      await this._playlistsService.verifyPlaylistOwner(id, userId);
      await this._playlistsService.deletePlaylistById(id);

      res.status(200).json({
        status: "success",
        message: "Playlist berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }

  async postSongToPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePostPlaylistSongPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { userId } = req.auth;

      // Verify song exists
      await this._songsService.getSongById(songId);

      // Verify access
      await this._playlistsService.verifyPlaylistAccess(id, userId);

      // Add song to playlist
      await this._playlistsService.addSongToPlaylist(id, songId);

      // Add activity
      await this._playlistsService.addActivity(id, songId, userId, "add");

      res.status(201).json({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongsFromPlaylistHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(id, userId);
      const playlist = await this._playlistsService.getSongsFromPlaylist(id);

      res.status(200).json({
        status: "success",
        data: {
          playlist,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSongFromPlaylistHandler(req, res, next) {
    try {
      this._validator.validateDeletePlaylistSongPayload(req.body);
      const { id } = req.params;
      const { songId } = req.body;
      const { userId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(id, userId);
      await this._playlistsService.deleteSongFromPlaylist(id, songId);

      // Add activity
      await this._playlistsService.addActivity(id, songId, userId, "delete");

      res.status(200).json({
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistActivitiesHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.auth;

      await this._playlistsService.verifyPlaylistAccess(id, userId);
      const activities = await this._playlistsService.getActivities(id);

      res.status(200).json({
        status: "success",
        data: {
          playlistId: id,
          activities,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PlaylistsHandler;
