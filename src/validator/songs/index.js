const { SongPayloadSchema } = require("./schema");

const SongValidator = {
  validatorSongpayload: (payload) => {
    SongPayloadSchema.validate(payload);
  },
};

module.exports = SongValidator;
