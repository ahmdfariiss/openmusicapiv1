// Mapping data album dari database
const mapDBToAlbumModel = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

// Mapping data lag udari database

const mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

// Mapping data lagu untuk list

const mapDBToSongListModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToAlbumModel, mapDBToSongModel, mapDBToSongListModel };
