# 🚀 Quick Start Guide - OpenMusic API v2

## Langkah-langkah Setup dan Testing (5 Menit)

### 1️⃣ Dependencies (SUDAH TERINSTALL ✅)

Dependencies sudah terinstall:
- ✅ bcrypt@5.1.1
- ✅ joi@17.11.0  
- ✅ jsonwebtoken@9.0.2
- ✅ express, pg, nanoid, dll.

**Jika perlu install ulang:**
```bash
npm install
```

---

### 2️⃣ Setup Database (WAJIB!)

**A. Pastikan PostgreSQL berjalan:**
```bash
# Ubuntu/Debian
sudo service postgresql start
sudo service postgresql status

# macOS (jika pakai Homebrew)
brew services start postgresql

# Windows (PowerShell)
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

**B. Buat database:**
```bash
# Cara 1: Menggunakan createdb
createdb openmusicapi

# Cara 2: Menggunakan psql
psql -U postgres
CREATE DATABASE openmusicapi;
\q
```

---

### 3️⃣ Setup Environment Variables (WAJIB!)

**A. Buat file `.env` dari template:**
```bash
cp .env.example .env
```

**B. Edit file `.env`:**
```bash
nano .env
# atau
code .env
# atau editor favorit Anda
```

**Isi minimal yang diperlukan:**
```env
# Database (sesuaikan dengan konfigurasi PostgreSQL Anda)
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=password_anda
PGDATABASE=openmusicapi
PGPORT=5432

# JWT Token (gunakan key yang kuat!)
ACCESS_TOKEN_KEY=ini_adalah_secret_key_untuk_access_token_minimal_32_karakter_panjangnya
REFRESH_TOKEN_KEY=ini_adalah_secret_key_untuk_refresh_token_minimal_32_karakter_panjangnya
```

**Generate secret key yang kuat (opsional tapi recommended):**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 4️⃣ Jalankan Migrations (WAJIB!)

```bash
npm run migrate up
```

**Output yang benar:**
```
> Running migration 1761311259930_create-table-albums.js
> Running migration 1761311508938_create-table-songs.js
> Running migration 1761653750397_create-table-users.js
> Running migration 1761653754917_create-table-authentications.js
> Running migration 1761653755366_create-table-playlists.js
> Running migration 1761653756103_create-table-playlist-songs.js
> Running migration 1761653756546_create-table-collaborations.js
> Running migration 1761653757122_create-table-playlist-song-activities.js
```

---

### 5️⃣ Start Server

```bash
# Development mode (dengan auto-reload)
npm run start:dev

# Production mode
npm start
```

**Output yang benar:**
```
Server berjalan pada http://localhost:5000
```

---

## 🧪 Testing API

### Opsi 1: Automated Test Script (Tercepat!)

```bash
bash test-api.sh
```

Script ini akan otomatis test:
- ✅ Server status
- ✅ User registration
- ✅ Login/authentication
- ✅ Create album
- ✅ Create song
- ✅ Create playlist
- ✅ Add song to playlist
- ✅ Get playlist songs
- ✅ Get playlist activities

---

### Opsi 2: Manual dengan cURL

**Terminal 1 - Start server:**
```bash
npm run start:dev
```

**Terminal 2 - Test endpoints:**

```bash
# 1. Test server
curl http://localhost:5000

# 2. Register user
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dicoding",
    "password": "supersecret",
    "fullname": "Dicoding Indonesia"
  }'

# 3. Login (SIMPAN accessToken dari response!)
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dicoding",
    "password": "supersecret"
  }'

# 4. Create playlist (ganti YOUR_ACCESS_TOKEN dengan token dari step 3)
curl -X POST http://localhost:5000/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Favorite Songs"
  }'

# 5. Get playlists
curl -X GET http://localhost:5000/playlists \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Opsi 3: Dengan Postman/Insomnia (Recommended!)

**1. Import collection:**
- Buka Postman
- File → Import → `openmusic-postman-collection.json`

**2. Setup environment:**
- Klik "⚙️ Manage Environments"
- Add environment baru
- Tambahkan variable `baseUrl` dengan value `http://localhost:5000`

**3. Jalankan requests:**
- Mulai dari folder "Users" → "Register User"
- Lalu "Authentications" → "Login" (accessToken akan otomatis tersimpan)
- Lanjut test endpoint lainnya secara berurutan

**4. Auto-save variables:**
Collection sudah dikonfigurasi untuk otomatis menyimpan:
- `accessToken` setelah login
- `userId`, `albumId`, `songId`, `playlistId` setelah create

---

## 📋 Checklist Testing

- [ ] Server berjalan di http://localhost:5000
- [ ] POST /users - Register user baru
- [ ] POST /authentications - Login berhasil dapat token
- [ ] POST /albums - Create album
- [ ] POST /songs - Create song
- [ ] POST /playlists - Create playlist (butuh auth)
- [ ] GET /playlists - Lihat daftar playlist
- [ ] POST /playlists/{id}/songs - Tambah lagu ke playlist
- [ ] GET /playlists/{id}/songs - Lihat lagu dalam playlist
- [ ] GET /playlists/{id}/activities - Lihat aktivitas playlist
- [ ] DELETE /playlists/{id}/songs - Hapus lagu dari playlist
- [ ] DELETE /playlists/{id} - Hapus playlist

---

## ⚠️ Troubleshooting

### Error: "ECONNREFUSED" / "Connection refused"
```bash
# Cek PostgreSQL berjalan
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start
```

### Error: "database does not exist"
```bash
# Buat database
createdb openmusicapi
```

### Error: "relation does not exist"
```bash
# Jalankan migrations
npm run migrate up
```

### Error: "password authentication failed"
```bash
# Cek kredensial di .env
# Pastikan PGUSER dan PGPASSWORD benar
```

### Error: "jwt malformed" / "invalid token"
```bash
# Cek file .env sudah ada ACCESS_TOKEN_KEY dan REFRESH_TOKEN_KEY
# Pastikan key minimal 32 karakter
```

### Server tidak start
```bash
# Cek port 5000 tidak dipakai
lsof -i :5000

# Atau ganti PORT di .env
PORT=3000
```

---

## 📖 Dokumentasi Lengkap

Lihat file berikut untuk info lebih detail:
- `README.md` - Dokumentasi lengkap API
- `IMPLEMENTATION_SUMMARY.md` - Ringkasan implementasi
- `.env.example` - Template environment variables

---

## 🎯 Endpoints yang Tersedia

### Public (Tanpa Auth):
- ✅ POST /users
- ✅ POST /authentications
- ✅ PUT /authentications
- ✅ DELETE /authentications
- ✅ POST /albums, GET /albums/{id}, PUT /albums/{id}, DELETE /albums/{id}
- ✅ POST /songs, GET /songs, GET /songs/{id}, PUT /songs/{id}, DELETE /songs/{id}

### Protected (Butuh Authorization Header):
- ✅ POST /playlists
- ✅ GET /playlists
- ✅ DELETE /playlists/{id}
- ✅ POST /playlists/{id}/songs
- ✅ GET /playlists/{id}/songs
- ✅ DELETE /playlists/{id}/songs
- ✅ GET /playlists/{id}/activities
- ✅ POST /collaborations
- ✅ DELETE /collaborations

---

**Happy Testing! 🎉**
