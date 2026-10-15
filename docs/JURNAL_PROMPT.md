# 📓 Jurnal Prompt Pengembangan Game Adabku
**Dokumentasi 5 Prompt Terkurasi Utama Pengembangan Media Belajar 3D Berbasis Vibe Coding**

---

## Informasi Proyek
* **Nama Proyek:** Adabku (Media Belajar Adab & Karakter Anak SD Berbasis Web 3D)
* **Kategori Lomba:** Pengembangan Aplikasi Web / Game Edukasi Interaktif
* **Pendekatan:** Vibe Coding & Agentic AI Pair Programming
* **Teknologi Utama:** React 19, Three.js, React Three Fiber, Tailwind CSS v4, Zustand, PeerJS

---

## 🎯 Ringkasan 5 Tahapan Prompt Terkurasi

| No | Tahapan | Fokus Prompt | Hasil & Capaian Kunci |
| :---: | :--- | :--- | :--- |
| **1** | **Ide & Arsitektur (PRD)** | Inisialisasi Konsep & Arsitektur Game Adabku 3D | Terbentuknya fondasi proyek React + Three.js, koridor lintasan, dan aturan syariat strictly faceless. |
| **2** | **Debugging Mendalam** | Perbaikan Bug Layar Hijau, Camera Clipping, & Vektor 360° | Perbaikan kendala visual layar hijau pada level 1, sudut kamera POV mata pemain, dan pergerakan lancar. |
| **3** | **Audit & Optimasi UI/UX** | Tampilan Ceria Bebas Blur, Kontrol Touch HP, & Onboarding Bertahap | Desain antarmuka pastel tajam ramah anak, penghapusan backdrop-blur, dan alur onboarding 4 langkah. |
| **4** | **Finishing & Kolaborasi** | Integrasi Logo, Kapsul Berpeci/Berjilbab, & PeerJS P2P | Pemasangan logo bulat Adabku di seluruh header, karakter kapsul faceless SD, dan multiplayer HP-Laptop. |
| **5** | **Fitur Tambahan / Bebas** | Variasi Tematik 5 Level & Mekanisme Tembakan Pistol Air | Visual khas 5 level (Masjid, Rumah, Sekolah, Alam, Arena) serta duel air memadamkan Sumber Laser Level 5. |

---

## 📝 Detail 5 Prompt Terkurasi

### PROMPT 1: Inisialisasi Konsep & Arsitektur Game Adabku (Ide / PRD)

#### Konteks & Tujuan:
Menetapkan fondasi arsitektur game edukasi 3D untuk anak SD dengan batasan syariat yang ketat (tanpa gambar makhluk bernyawa, tanpa musik latar, tanpa suara tepuk tangan), struktur modular komponen Three.js, serta mekanisme runner edukatif.

#### Teks Prompt:
> *"Tolong bangunkan arsitektur awal game web 3D 'Adabku' untuk anak Sekolah Dasar (SD) menggunakan React, Three.js (@react-three/fiber), dan Tailwind CSS. Game ini bertujuan mengajarkan adab harian Islam (menghormati orang tua, ketertiban shalat di masjid, dan adab menuntut ilmu) melalui petualangan koridor 3D. Pastikan sistem mematuhi aturan syariat berikut: karakter strictly faceless/geometris (tanpa wajah/mata/hidung/mulut), sistem audio tanpa BGM (tanpa musik latar) dan tanpa efek suara tepuk tangan. Buat sistem pergerakan manual (WASD/panah dan tombol sentuh), rintangan laser melayang dengan label adab buruk yang harus dihindari dengan melompat atau menunduk, serta checkpoint kuis interaktif tipe Benar/Salah dan Boleh/Tidak Boleh."*

#### Analisis Hasil & Eksekusi:
1. Terbentuk struktur proyek React Three Fiber dengan kanvas 3D performa tinggi (`GameCanvas.jsx`).
2. Implementasi modul pemisahan state fisika mutabel (`playerState.js`) agar berjalan lancar di 60 FPS tanpa re-render React.
3. Terciptanya sistem rintangan laser merah dengan deteksi tabrakan presisi terhadap tinggi lompatan dan tundukan karakter.

---

### PROMPT 2: Perbaikan Bug Layar Hijau & Kamera POV 360° (Debugging)

#### Konteks & Tujuan:
Mengatasi masalah tampilan layar hijau (*green screen bug*) yang terjadi di Level 1 akibat kesalahan clipping bidang tanah marmer dan penempatan billboard 3D di depan lensa kamera pemain, serta menyempurnakan orientasi pergerakan pemain searah pandangan kamera.

#### Teks Prompt:
> *"Lakukan debugging mendalam pada Level 1 Adabku. Saat level dimulai, terjadi bug visual layar hijau yang menutupi pandangan pemain dan kamera mengalami clipping. Tolong ubah sistem kamera menjadi First-Person POV yang presisi di mana posisi kamera tepat berada di titik mata pemain tanpa ada billboard atau nametag yang menghalangi pandangan ke depan. Pastikan vektor pergerakan pemain (maju, mundur, ke samping) selalu bergerak relatif terhadap arah hadap kamera (360° yaw), dan pasang batas pembatas lintasan agar karakter tidak tembus dinding koridor."*

#### Analisis Hasil & Eksekusi:
1. Komponen `FirstPersonPlayer.jsx` dibuat ulang untuk memastikan kamera berada di ketinggian mata (`y = 1.6m` saat berdiri, `y = 0.95m` saat menunduk) dengan arah hadap tepat ke lintasan.
2. Memperbaiki tekstur marmer masjid dan menghilangkan billboard lokal di depan kamera pemain lokal.
3. Rumus trigonometri arah pergerakan (`fwdX`, `fwdZ`, `rightX`, `rightZ`) diterapkan sehingga tombol arah selalu sinkron dengan sudut pandang kamera.

---

### PROMPT 3: Tampilan Ceria Bebas Blur & Alur Onboarding Bertahap (Audit & Optimasi UI/UX)

#### Konteks & Tujuan:
Menyesuaikan antarmuka agar ramah bagi anak-anak SD dengan menghapus efek transparan buram (*blur*) yang membuat teks sulit dibaca, memecah menu awal menjadi 4 langkah sederhana, serta menambahkan kendali usapan jari (*touch drag*) pada perangkat mobile.

#### Teks Prompt:
> *"Lakukan audit dan penyempurnaan UI/UX menyeluruh pada game Adabku agar ramah untuk anak usia SD. Pertama, hapus seluruh efek backdrop-blur dan overlay gelap; ganti dengan warna-warna pastel cerah (hijau mint, biru muda, kuning ceria) dengan kontras tajam yang bersih dan terang benderang. Kedua, pecah antarmuka awal menjadi 4 langkah sederhana (Step-by-Step Onboarding): Langkah 1 Layar Selamat Datang dengan tombol besar [ Siap Belajar & Mainkan ], Langkah 2 Pemilihan Karakter Kapsul Faceless & Input Nama, Langkah 3 Pilihan Mode (Single/Multiplayer), dan Langkah 4 Pemilihan Level. Ketiga, tambahkan event listener touch drag pada layar HP agar pandangan kamera First-Person bisa diputar 360° secara mulus dengan usapan jari."*

#### Analisis Hasil & Eksekusi:
1. File `StartScreen.jsx` dan `primitives.jsx` diperbarui dengan menghilangkan kelas `backdrop-blur-md` dan menerapkan skema warna solid cerah.
2. Alur 4 langkah onboarding berhasil diterapkan dengan navigasi tombol besar yang intuitif bagi anak SD.
3. Event listener `touchstart`, `touchmove`, dan `touchend` diintegrasikan pada `FirstPersonPlayer.jsx` dengan sensitivitas halus untuk kemudahan bermain di layar sentuh smartphone.

---

### PROMPT 4: Integrasi Logo Adabku, Kapsul SD, & Real-Time PeerJS P2P (Finishing)

#### Konteks & Tujuan:
Menyelesaikan aspek branding dengan logo resmi Adabku yang konsisten, model karakter 3D berpeci dan berjilbab yang patuh syariat, serta mengaktifkan modul multiplayer WebRTC P2P antar perangkat (Laptop dan HP) menggunakan PeerJS dan Google STUN server.

#### Teks Prompt:
> *"Lakukan finishing pada game Adabku: 1) Pasang logo bulat Adabku (public/logo.png) secara konsisten di samping judul pada Landing Screen, Header Menu, HUD In-Game, Layar Kuis, dan Pause Menu. 2) Buat model visual 3D Kapsul SD strictly faceless: Kapsul Laki-laki berseragam SD dengan Peci/Songkok Hitam Polos, dan Kapsul Perempuan berseragam SD dengan Jilbab Putih Polos. 3) Konfigurasikan modul multiplayer PeerJS dengan Google STUN Server (stun:stun.l.google.com:19302) dan kode room bersama (default: ADABKU123) agar Laptop dan HP dapat saling terhubung dan melihat pergerakan avatar pemain lain secara real-time lengkap dengan 3D Floating Name Tag di atas kepala."*

#### Analisis Hasil & Eksekusi:
1. Komponen `AdabkuLogo.jsx` diciptakan dan dipasang seragam pada seluruh modal, menu awal, dan HUD permainan.
2. Komponen `CapsuleCharacter.jsx` menyajikan representasi model 3D anak SD berpeci dan berjilbab yang elegan dan 100% syariat-compliant tanpa wajah.
3. Modul `multiplayer.js` dan `RealtimePlayers.jsx` berhasil memancarkan data posisi 3D pada frekuensi 20 FPS (50ms) dan menampilkan status koneksi interaktif di HUD.

---

### PROMPT 5: Variasi Tematik 5 Level & Tembakan Pistol Air Level 5 (Fitur Tambahan)

#### Konteks & Tujuan:
Memperkaya variasi edukasi adab dengan menghadirkan 5 lingkungan latar belakang berbeda (Masjid, Rumah, Sekolah, Hutan, Arena) serta puncak tantangan pada Level 5 di mana pemain menggunakan pistol air untuk memadamkan menara pemancar perilaku buruk.

#### Teks Prompt:
> *"Sempurnakan variasi gameplay 5 level game Adabku: Level 1 (Masjid Nabawi Suci), Level 2 (Rumah Pemukiman Hangat), Level 3 (Sekolah Kartun Ceria), Level 4 (Hutan & Kebun Asri), dan Level 5 (Arena Laser Terbuka). Terapkan aturan unlock berurutan di mana Level 2 s.d. 5 terkunci dan baru terbuka setelah level sebelumnya diselesaikan. Khusus Level 5: buat lapangan lingkaran terbuka dengan Menara Pemancar Laser di tengah dan dinding pembatas tak terlihat (invisible wall box) agar pemain tidak jatuh keluar. Berikan pemain Pistol Air (Water Gun) untuk menembakkan air biru ke arah menara hingga HP menara habis dari 8 ke 0 sebagai Kemenangan Utama, serta butiran soal puzzle 3x3 untuk mengisi ulang amunisi air."*

#### Analisis Hasil & Eksekusi:
1. `Arena.jsx` diperkaya dengan tekstur lantai, pilar, dan ornamen lingkungan yang berbeda secara dinamis untuk setiap Level 1 s.d. 4.
2. Sistem *progression unlock* di `gameStore.js` menyimpan status level terbuka ke `localStorage`.
3. Komponen `LaserTowerArena.jsx` menghadirkan arena lingkaran 360°, pembatas dinding tak terlihat pada radius 23.8m, sistem *projectile pooling* pistol air, dan mini-game puzzle 3x3 drag-and-drop.

---

## 🏆 Kesimpulan & Refleksi Pengembangan
Melalui pendekatan *Vibe Coding* yang terarah dan iteratif, game **Adabku** berhasil dikembangkan dari konsep dasar menjadi media edukasi karakter 3D berbasis web yang lengkap, stabil, ringan, berkinerja tinggi, dan patuh penuh terhadap kaidah syariat Islam.
