const { AlbumPayloadSchema } = require("./schema");

const AlbumValidator = {
  valdiateAlbumPayload: (payload) => {
    AlbumPayloadSchema.validate(payload);
  },
};

module.exports = AlbumValidator;
