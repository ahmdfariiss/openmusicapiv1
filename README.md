# OpenMusic API v2.0.0

API untuk manajemen album, lagu, playlist dengan fitur autentikasi pengguna dan kolaborasi.

## 🚀 Cara Setup dan Testing

### 1. Install Dependencies

Dependencies sudah terinstall, tapi jika diperlukan jalankan:

```bash
npm install
```

### 2. Setup Database PostgreSQL

Buat database baru:

```bash
# Menggunakan command line
createdb openmusicapi

# Atau menggunakan psql
psql -U postgres
CREATE DATABASE openmusicapi;
\q
```

### 3. Setup Environment Variables

Buat file `.env` dari template:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=password_anda
PGDATABASE=openmusicapi
PGPORT=5432

# JWT Token Configuration (gunakan key yang kuat!)
ACCESS_TOKEN_KEY=ini_adalah_secret_key_untuk_access_token_minimal_32_karakter
REFRESH_TOKEN_KEY=ini_adalah_secret_key_untuk_refresh_token_minimal_32_karakter
ACCESS_TOKEN_AGE=1800
```

**PENTING:** Untuk production, generate secret key yang kuat:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Jalankan Database Migrations

```bash
npm run migrate up
```

Output yang benar:
```
> openmusic-api@2.0.0 migrate
> node-pg-migrate up

> Running migration 1761311259930_create-table-albums.js
> Running migration 1761311508938_create-table-songs.js
> Running migration 1761653750397_create-table-users.js
> Running migration 1761653754917_create-table-authentications.js
> Running migration 1761653755366_create-table-playlists.js
> Running migration 1761653756103_create-table-playlist-songs.js
> Running migration 1761653756546_create-table-collaborations.js
> Running migration 1761653757122_create-table-playlist-song-activities.js
```

### 5. Start Server

**Development mode (dengan auto-reload):**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

---

## 🧪 Testing API

### Menggunakan cURL

#### 1️⃣ Test Server Status
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "message": "OpenMusic API v2.0.0",
  "status": "running"
}
```

#### 2️⃣ Registrasi User Baru
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dicoding",
    "password": "supersecret",
    "fullname": "Dicoding Indonesia"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "userId": "user-xxxxxxxxxxxx"
  }
}
```

#### 3️⃣ Login (Autentikasi)
```bash
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dicoding",
    "password": "supersecret"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**SIMPAN accessToken untuk request selanjutnya!**

#### 4️⃣ Tambah Album
```bash
curl -X POST http://localhost:5000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viva La Vida",
    "year": 2008
  }'
```

#### 5️⃣ Tambah Lagu
```bash
curl -X POST http://localhost:5000/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Life in Technicolor",
    "year": 2008,
    "performer": "Coldplay",
    "genre": "Alternative Rock",
    "duration": 120
  }'
```

Simpan `songId` dari response!

#### 6️⃣ Buat Playlist (Authenticated)
```bash
curl -X POST http://localhost:5000/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_DISINI" \
  -d '{
    "name": "My Favorite Coldplay"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist-xxxxxxxxxxxx"
  }
}
```

#### 7️⃣ Tambah Lagu ke Playlist
```bash
curl -X POST http://localhost:5000/playlists/PLAYLIST_ID/songs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{
    "songId": "SONG_ID"
  }'
```

#### 8️⃣ Lihat Playlist
```bash
curl -X GET http://localhost:5000/playlists \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

#### 9️⃣ Lihat Lagu dalam Playlist
```bash
curl -X GET http://localhost:5000/playlists/PLAYLIST_ID/songs \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

#### 🔟 Lihat Activity Playlist
```bash
curl -X GET http://localhost:5000/playlists/PLAYLIST_ID/activities \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

## 📋 Testing dengan Postman/Insomnia

Saya akan membuat test collection untuk memudahkan testing.

### Import Collection ke Postman

1. Buka Postman
2. Import file `openmusic-postman-collection.json`
3. Buat environment dengan variabel:
   - `baseUrl`: http://localhost:5000
   - `accessToken`: (akan diisi otomatis setelah login)

### Urutan Testing:

1. **Setup** → Test Server
2. **Users** → Register User
3. **Authentications** → Login (accessToken akan tersimpan otomatis)
4. **Albums** → Create Album
5. **Songs** → Create Song
6. **Playlists** → Create Playlist
7. **Playlists** → Add Song to Playlist
8. **Playlists** → Get Playlists
9. **Playlists** → Get Playlist Songs
10. **Playlists** → Get Playlist Activities

---

## 🔧 Troubleshooting

### Error: "ECONNREFUSED"
- Pastikan PostgreSQL sedang berjalan
- Cek kredensial database di `.env`

### Error: "relation does not exist"
- Jalankan migrations: `npm run migrate up`

### Error: "jwt malformed" atau "invalid token"
- Pastikan ACCESS_TOKEN_KEY dan REFRESH_TOKEN_KEY sudah diset di `.env`
- Token harus dikirim dengan format: `Authorization: Bearer <token>`

### Error: "username sudah digunakan"
- Username harus unik, gunakan username lain

### Server tidak start
- Cek port 5000 tidak digunakan aplikasi lain
- Ubah PORT di `.env` jika perlu

---

## 📖 API Endpoints

### Public Endpoints (Tanpa Auth)
- `POST /users` - Registrasi user
- `POST /authentications` - Login
- `PUT /authentications` - Refresh token
- `DELETE /authentications` - Logout
- `POST /albums` - Create album
- `GET /albums/{id}` - Get album detail
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Delete album
- `POST /songs` - Create song
- `GET /songs` - Get songs (support query: ?title=...&performer=...)
- `GET /songs/{id}` - Get song detail
- `PUT /songs/{id}` - Update song
- `DELETE /songs/{id}` - Delete song

### Protected Endpoints (Butuh Authorization Header)
- `POST /playlists` - Create playlist
- `GET /playlists` - Get user playlists
- `DELETE /playlists/{id}` - Delete playlist
- `POST /playlists/{id}/songs` - Add song to playlist
- `GET /playlists/{id}/songs` - Get playlist songs
- `DELETE /playlists/{id}/songs` - Remove song from playlist
- `GET /playlists/{id}/activities` - Get playlist activities
- `POST /collaborations` - Add collaborator
- `DELETE /collaborations` - Remove collaborator

---

## 🎯 Fitur yang Diimplementasikan

### Kriteria Wajib (6/6) ✅
1. ✅ Registrasi dan Autentikasi Pengguna
2. ✅ Pengelolaan Data Playlist
3. ✅ Menerapkan Foreign Key
4. ✅ Menerapkan Data Validation
5. ✅ Penanganan Error
6. ✅ Mempertahankan Fitur OpenMusic V1

### Kriteria Opsional (3/3) ✅
1. ✅ Fitur Kolaborator Playlist
2. ✅ Fitur Playlist Activities
3. ✅ Mempertahankan Kriteria Opsional V1

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "joi": "^17.11.0",
    "jsonwebtoken": "^9.0.2",
    "nanoid": "^3.3.7",
    "pg": "^8.11.3"
  }
}
```

---

## 👨‍💻 Author

OpenMusic API v2 - Dicoding Submission Project

## 📄 License

ISC
