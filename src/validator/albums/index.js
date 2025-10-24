const { AlbumPayloadSchema } = require("./schema");

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    AlbumPayloadSchema.validate(payload);
  },
};

module.exports = AlbumValidator;
