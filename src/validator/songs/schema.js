const InvariantError = require("../../exceptions/InvariantError");

const SongPayloadSchema = {
  validate: (payload) => {
    const { title, genre, year, performer, duration, albumId } = payload;

    // Validasi Judul

    if (!title || typeof title !== "string" || title.trim() === "") {
      throw new InvariantError(
        "Gagal menambhakan lagu. mohon isi judul lagu dengan benar"
      );
    }

    // Validasi Tahun (required)

    if (!year || typeof year !== "number") {
      throw new InvariantError(
        "gagal menambhakan lagu, mohon isi tahun lagu dengan benar"
      );
    }

    if (year < 1900 || year > new Date().getFullYear() + 1) {
      throw new InvariantError(
        "Gagal menbambhakan lagu, silahkan isi tahun lagu dengan benar"
      );
    }

    // Validasi genre (required)
    if (!genre || typeof genre !== "string" || genre.trim() === "") {
      throw new InvariantError(
        "Gagal menambahkan lagu. Mohon isi genre lagu dengan benar"
      );
    }

    // Validasi performer (required)
    if (
      !performer ||
      typeof performer !== "string" ||
      performer.trim() === ""
    ) {
      throw new InvariantError(
        "Gagal menambahkan lagu. Mohon isi performer lagu dengan benar"
      );
    }

    // Validasi duration (optional, tapi jika ada harus number)
    if (
      duration !== undefined &&
      duration !== null &&
      typeof duration !== "number"
    ) {
      throw new InvariantError("Duration harus berupa angka");
    }

    // Validasi albumId (optional, tapi jika ada harus string)
    if (
      albumId !== undefined &&
      albumId !== null &&
      typeof albumId !== "string"
    ) {
      throw new InvariantError("Album ID harus berupa string");
    }
  },
};

module.exports = { SongPayloadSchema };
