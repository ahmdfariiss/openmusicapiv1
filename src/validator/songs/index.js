const { SongPayloadSchema } = require("./schema");

const SongValidator = {
  validateSongPayload: (payload) => {
    SongPayloadSchema.validate(payload);
  },
};

module.exports = SongValidator;
