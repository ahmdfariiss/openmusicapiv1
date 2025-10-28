class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);
      const { playlistId, userId } = req.body;
      const { userId: owner } = req.auth;

      await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
      await this._usersService.getUserById(userId);

      const collaborationId = await this._collaborationsService.addCollaboration(
        playlistId,
        userId
      );

      res.status(201).json({
        status: "success",
        data: {
          collaborationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);
      const { playlistId, userId } = req.body;
      const { userId: owner } = req.auth;

      await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      res.status(200).json({
        status: "success",
        message: "Kolaborasi berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CollaborationsHandler;
