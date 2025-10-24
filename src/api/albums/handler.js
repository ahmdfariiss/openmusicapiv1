const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Binding
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, res) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { name, year } = req.body;

      const albumId = await this._service.addAlbum({ name, year });

      return res.status(201).json({
        status: "success",
        data: {
          albumId,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
          status: "fail",
          message: error.message,
        });
      }

      // Server Error
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
    }
  }

  async getAlbumByIdHandler(req, res) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      return res.status(200).json({
        status: "success",
        data: {
          album,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
          status: "fail",
          message: error.message,
        });
      }

      // Server Error
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
    }
  }

  async putAlbumByIdHandler(req, res) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { id } = req.params;
      const { name, year } = req.body;

      await this._service.editAlbumById(id, { name, year });

      return res.status(200).json({
        status: "success",
        message: "Album berhasil diperbarui",
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
          status: "fail",
          message: error.message,
        });
      }

      // Server Error
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
    }
  }

  async deleteAlbumByIdHandler(req, res) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      return res.status(200).json({
        status: "success",
        message: "Album berhasil dihapus",
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
          status: "fail",
          message: error.message,
        });
      }

      // Server Error
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
    }
  }
}

module.exports = AlbumsHandler;
