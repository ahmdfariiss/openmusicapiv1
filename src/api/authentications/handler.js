const TokenManager = require("../../tokenize/TokenManager");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async postAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePostAuthenticationPayload(req.body);

      const { username, password } = req.body;
      const id = await this._usersService.verifyUserCredential(
        username,
        password
      );

      const accessToken = TokenManager.generateAccessToken({ userId: id });
      const refreshToken = TokenManager.generateRefreshToken({ userId: id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      res.status(201).json({
        status: "success",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePutAuthenticationPayload(req.body);

      const { refreshToken } = req.body;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { userId } = TokenManager.verifyRefreshToken(refreshToken);

      const accessToken = TokenManager.generateAccessToken({ userId });

      res.status(200).json({
        status: "success",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.body);

      const { refreshToken } = req.body;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      res.status(200).json({
        status: "success",
        message: "Refresh token berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsHandler;
