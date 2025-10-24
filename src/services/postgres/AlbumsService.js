const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToAlbumModel, mapDBToSongListModel } = require("../../utils");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  // add album
  async addAlbum({ name, year }) {
    const id = `albums-${nanoId(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album Gagal Ditambahkan");
    }

    return result.rows[0].id;
  }

  // get album by id
  async getAlbumById({ id }) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = mapDBToAlbumModel(result.rows[0]);

    // get song in this album
    const songQuery = {
      text: "SELECt id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    };

    const songResult = await this._pool.query(songQuery);
    album.songs = songResult.rows.map(mapDBToSongListModel);

    return album;
  }

  // edit alkbum by id
  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  // delete album by id
  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
