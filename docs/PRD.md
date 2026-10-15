# 📋 Product Requirements Document (PRD): Adabku
**Media Belajar Adab & Pendidikan Karakter Anak SD Berbasis 3D Web Interaktif**

---

## 1. Ringkasan Eksekutif & Visi Produk

### 1.1 Visi
Membangun platform permainan edukasi 3D berbasis peramban web (*browser-based*) yang imersif, menyenangkan, dan berlandaskan syariat Islam untuk membentuk karakter dan adab harian anak Sekolah Dasar (SD) usia 6–12 tahun.

### 1.2 Latar Belakang Masalah
* **Tantangan Pendidikan Karakter:** Pendidikan adab dan akhlak seringkali disampaikan melalui metode hafalan teks satu arah yang kurang menarik bagi anak generasi digital.
* **Maraknya Game Kurang Mendidik:** Banyak permainan digital yang mengandung kekerasan, visual makhluk bernyawa yang melanggar syariat, musik latar berlebihan, atau iklan yang tidak aman bagi anak.
* **Kebutuhan Media Interaktif Cross-Platform:** Diperlukan game interaktif yang ringan, mudah diakses langsung tanpa instalasi rumit dari laptop sekolah maupun gawai (smartphone/tablet) orang tua di rumah.

### 1.3 Solusi: Adabku
Game petualangan 3D interaktif yang menggabungkan:
1. **Gameplay 3D Exploration & Runner:** Menjelajahi 5 level tematik dengan kontrol First-Person / Third-Person mulus.
2. **Kuis Adab Studi Kasus & Puzzle 3x3:** Checkpoint pembelajaran aplikatif yang melatih nalar anak mengambil keputusan beradab.
3. **Multiplayer P2P Edukatif:** Bermain bersama teman sekelas atau orang tua secara real-time antar perangkat (HP & Laptop).
4. **Kepatuhan Syariat Penuh:** Strictly Faceless (tanpa wajah makhluk bernyawa), tanpa musik latar (No BGM), dan tanpa efek tepuk tangan.

---

## 2. Target Pengguna & Persona

* **Target Utama:** Siswa/Siswi Sekolah Dasar kelas 1 s.d. 6 (Usia 6–12 tahun).
* **Target Sekunder:** Guru PAI / Wali Kelas SD, serta Orang Tua yang mendampingi belajar anak di rumah.
* **Karakteristik Pengguna:**
  * Menyukai visual cerah, ramah, dan interaktif (warna-warna pastel ceria).
  * Membutuhkan instruksi singkat dan tombol yang besar serta mudah ditekan.
  * Menggunakan beragam perangkat: Laptop Chromebook sekolah, PC lab komputer, tablet, atau smartphone Android/iOS.

---

## 3. Fitur Utama Produk (Product Features)

### 3.1 Alur 4-Step Onboarding UI Ceria (Kids-Friendly Flow)
Antarmuka pembukaan didesain berjenjang agar anak tidak kewalahan dengan teks panjang:
1. **Langkah 1: Layar Selamat Datang (Landing Screen):**
   * Logo Bulat Adabku berukuran besar dan tajam di tengah.
   * Judul ceria dan pengantar singkat petualangan karakter.
   * Satu tombol utama besar: `[ Siap Belajar & Mainkan ]`.
   * **Bebas Blur:** Menghilangkan seluruh lapisan buram (`backdrop-blur`) agar visual tampil jernih, tajam, dan kontras.
2. **Langkah 2: Profil & Pemilihan Karakter Kapsul Faceless:**
   * **Kapsul Laki-laki:** Model 3D Kapsul seragam SD (kemeja putih + celana merah) dengan Peci/Songkok Hitam Polos (*Strictly Faceless*, tanpa detail mata/hidung/mulut).
   * **Kapsul Perempuan:** Model 3D Kapsul seragam SD (kemeja putih + rok merah) dengan Jilbab Putih Polos (*Strictly Faceless*, tanpa detail mata/hidung/mulut).
   * Form input nama panggilan sederhana (maksimal 15 karakter).
3. **Langkah 3: Pilihan Mode Game:**
   * **Mode Single Player:** Petualangan mandiri menyelesaikan misi tiap level.
   * **Mode Multiplayer P2P:** Bermain bersama teman secara real-time via Kode Room bersama (default: `ADABKU123`).
4. **Langkah 4: Pemilihan Level (Progression Unlock):**
   * Grid kotak Level 1 s.d. 5 yang bersih dan ceria.
   * Level terkunci diberi tanda gembok dan status "Selesaikan level sebelumnya".

---

### 3.2 Sistem 5 Level Adab Berurutan (Progression Unlock)
Pemain wajib menyelesaikan level sebelumnya untuk membuka level berikutnya:

| Level | Nama Level & Lingkungan | Tema Pembelajaran Adab | Rintangan Laser Adab Buruk | Checkpoint Soal / Mini-Game |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Masjid (Masjid Nabawi Suci)** | Adab Masuk & Shalat di Masjid | Melangkah di Depan Orang Shalat, Bercanda Saat Shalat, Masuk Kaki Kiri, Berbicara Keras | 4 Checkpoint Kuis Adab Studi Kasus (Boleh / Tidak Boleh & Benar / Salah) |
| **2** | **Rumah (Pemukiman Hangat)** | Adab Berbakti kepada Orang Tua | Membentak Orang Tua, Main Game Lupa Waktu, Masuk Kamar Tanpa Salam, Meninggalkan Piring Kotor | 4 Checkpoint Kuis Adab Rumah |
| **3** | **Sekolah (Halaman Low-Poly)** | Adab Menuntut Ilmu & Berteman | Mencontek Saat Ujian, Menjahili Teman, Datang Terlambat, Membuang Sampah Sembarangan | 4 Checkpoint Kuis Adab Sekolah |
| **4** | **Hutan & Alam (Kebun Asri)** | Adab Kelestarian Lingkungan | Merusak Tanaman, Buang Sampah di Sungai, Mencabut Bunga, Menganiaya Hewan | 4 Checkpoint Kuis Adab Alam |
| **5** | **Arena Laser (Pusat Ujian)** | Melawan & Memadamkan Perilaku Buruk | Sombong, Riya', Berbohong, Iri Hati, Fitnah, Suka Marah, Dendam | Tembakan Pistol Air vs Menara Laser + Puzzle 3x3 Drag-and-Drop |

---

### 3.3 Mekanisme Gameplay Level 1 s.d. 4 (Koridor Lurus Bersih)
* **Lintasan Lurus Bersih:** Menghapus rute cabang memutar; pemain berlari lurus menyusuri lintasan tematik.
* **Checkpoint Orb Bercahaya:** Ketika pemain menyentuh bola cahaya di lintasan (jarak z: -40, -80, -120, -160), permainan membekukan aksi dan memunculkan pop-up Kuis Adab.
* **Reward:** Jawaban benar memberikan bonus +50 poin dan 1 Perisai Adab (maksimal 3 perisai). Jawaban salah memberikan penjelasan ramah anak.
* **Rintangan Laser Pink Neon Melayang:**
  * **Laser Rendah (y = 0.38m):** Dihindari dengan **Melompat** (Spasi / Tombol Lompat).
  * **Laser Tinggi (y = 1.22m):** Dihindari dengan **Menunduk Gepeng** (Ctrl/Shift / Tombol Menunduk).
  * Menabrak laser menghabiskan 1 Perisai atau 1 Nyawa Hati (Total 3 Nyawa).

---

### 3.4 Mekanisme Gameplay Level 5 (Arena Terbuka & Pistol Air)
* **Lapangan Lingkar Terbuka 360°:** Pemain bebas berlari mengelilingi lapangan beradius 24 meter.
* **Menara Pemancar Laser Pusat:** Memancarkan tembakan laser Pink Neon 4 arah yang berputar secara dinamis.
* **Pistol Air (Water Gun):** Pemain menembakkan percikan air biru bercahaya ke arah menara pemancar laser pusat dengan menekan tombol `F` atau tombol sentuh `💦 TEMBAK`.
* **Kemenangan Utama:** Mengurangi HP menara dari 8 poin hingga padam total (0 HP) menjadi penanda kemenangan mutlak game Adabku.
* **Mini-Game Puzzle 3x3 Drag-and-Drop:** Mengambil orb butiran adab di arena memicu mini-game menyusun puzzle 3x3 secara interaktif untuk mengisi ulang amunisi pistol air.
* **Pembatas Arena Tak Terlihat (*Invisible Wall Boundaries*):** Dinding pembatas lingkaran tak terlihat di sekeliling lapangan (radius 23.8m) dan menara tengah (radius 3.8m) mencegah pemain jatuh keluar dari arena permainan.

---

### 3.5 Real-Time PeerJS Multiplayer (WebRTC P2P)
* **Koneksi Lintas Perangkat:** Menghubungkan pemain di Laptop dan pemain di HP secara real-time melalui broker PeerJS dan Google STUN Server publik (`stun:stun.l.google.com:19302`).
* **Sistem Kode Room:** Menggunakan kode bersama (default: `ADABKU123`). Perangkat pertama bertindak sebagai Host dan perangkat berikutnya otomatis menjadi Client.
* **Broadcast 20 FPS (50ms):** Menyinkronkan koordinat X, Y, Z, rotasi tubuh, status melompat/menunduk, nama, dan jenis seragam karakter.
* **Avatar Pemain Lain:** Ditampilkan secara visual di layar 3D berupa Kapsul Berpeci/Berjilbab lengkap dengan 3D Floating Name Tag di atas kepala.

---

### 3.6 Kepatuhan Syariat & Audio Visual
* **Strictly Faceless (100% Syariat Compliant):** Dilarang keras menggambarkan mata, hidung, mulut, atau bentuk makhluk bernyawa pada model 3D maupun ilustrasi 2D.
* **Laser Pink Neon Bright:** Proyektil laser diberi warna Pink Neon (`#ff0077`) dengan inti putih terang agar kontras dan ramah anak.
* **Sistem Audio Bersih:**
  * **Tanpa Musik Latar (No BGM):** Musik latar ditiadakan sepenuhnya.
  * **SFX Sintetis Lembut:** Efek suara dibuat menggunakan Web Audio API murni (gelombang sine & triangle lembut).
  * **Dilarang Suara Tepuk Tangan:** Efek kemenangan digantikan oleh arpeggio harmoni nada mulia.

---

## 4. Persyaratan Non-Fungsional (Non-Functional Requirements)

1. **Performa:** Stabil pada 60 FPS di desktop dan minimal 45–60 FPS di perangkat smartphone modern (Web Audio API & Three.js Canvas).
2. **Kecepatan Memuat (Load Time):** Ukuran bundle JavaScript dioptimalkan melalui *vendor chunk splitting* (< 1 MB vendor gzipped) dan aset lokal tanpa dependensi berat.
3. **Penyimpanan Lokal (Offline Persistence):** Nama pemain, gender pilihan, progres unlock level 1–5, dan rekor skor tertinggi tersimpan di `localStorage` peramban.
4. **Keamanan & Privasi:** Tidak ada penyimpanan data pribadi anak ke server luar; data WebRTC langsung terenkripsi peer-to-peer.
