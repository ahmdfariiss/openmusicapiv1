const InvariantError = require("../../exceptions/InvariantError");

const AlbumPayloadSchema = {
  validate: (payload) => {
    const { name, year } = payload;
    // Validasi nama
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new InvariantError(
        "Gagal menambahkan album. silahkan isi nama album dengan benar"
      );
    }

    // Validasi Tahun
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      throw new InvariantError("Tahun album tidak valid");
    }
  },
};
module.exports = { AlbumPayloadSchema };
