# 📜 Log Riwayat Prompt Mentah (Raw Prompt Log)
**Rekapitulasi Kronologis Seluruh Instruksi Prompt Pengembangan Game Adabku**
*Lampiran Bukti Keaslian & Integritas Proses Vibe Coding*

---

## 📅 Sesi 1: Inisialisasi Proyek, Konsep Dasar, & Arsitektur 3D
**Waktu:** 14 Oktober 2026  
**Topik:** Setup Proyek Game Adabku & Fondasi Awal

### Prompt 1.1:
```text
Tolong buatkan proyek game edukasi 3D berbasis web berjudul "Adabku" menggunakan React, Three.js (@react-three/fiber), dan Tailwind CSS. Game ini bertujuan untuk membentuk karakter dan adab harian anak SD (menghormati orang tua, ketertiban shalat di masjid, dan adab menuntut ilmu). Karakter utama berupa model 3D geometris tanpa detail wajah (strictly faceless) untuk menjaga batasan syariat Islam, audio tanpa BGM (tanpa musik latar) dan tanpa suara tepuk tangan. Lintasan berupa koridor runner dengan kontrol manual (WASD / tombol panah), rintangan laser bertuliskan adab buruk yang harus dihindari dengan lompat atau menunduk, serta kuis adab di titik checkpoint tertentu.
```

### Prompt 1.2:
```text
Tambahkan kontrol virtual joystick dan tombol sentuh (Lompat dan Menunduk) agar game bisa dimainkan dengan nyaman di layar HP dan tablet. Buat layout UI yang besar, bersih, dan ramah anak.
```

### Prompt 1.3:
```text
Perbaiki sistem pergerakan karakter agar tidak terjadi re-render berkala pada kanvas React. Pisahkan state pergerakan pemain ke file tersendiri di luar state React.
```

---

## 📅 Sesi 2: Debugging Visual, Kamera POV 360°, & Desain 5 Level
**Waktu:** 15 Oktober 2026 (Pagi)  
**Topik:** Mengatasi Layar Hijau & Ekspansi 5 Level Adab

### Prompt 2.1:
```text
Saat Level 1 dimulai, terjadi bug visual di mana layar tertutup warna hijau dan kamera mengalami clipping. Tolong perbaiki agar sudut pandang menjadi First-Person POV bersih yang berada tepat di ketinggian mata pemain menatap lurus ke lintasan koridor masjid, tanpa ada billboard nama yang menutupi kamera pemain sendiri.
```

### Prompt 2.2:
```text
Perbaiki kalkulasi arah jalan karakter. Ketika pemain memutar sudut pandang kamera, tombol maju (W) harus selalu menggerakkan karakter ke arah hadap kamera, bukan ke sumbu Z absolut. Gunakan trigonometri sin dan cos dari yaw kamera.
```

### Prompt 2.3:
```text
Kembangkan permainan menjadi 5 level tematik dengan latar belakang berbeda yang cocok untuk anak SD:
1. Level 1: Masjid (Masjid Nabawi Suci, marmer putih lis emas, karpet zamrud)
2. Level 2: Rumah (Pemukiman hangat, paving terracotta, adab kepada orang tua)
3. Level 3: Sekolah (Halaman sekolah kartun ceria, lintasan olahraga, adab menuntut ilmu)
4. Level 4: Hutan & Alam (Kebun asri, setapak kayu, adab kelestarian lingkungan)
5. Level 5: Arena Terbuka (Lapangan melingkar 360° dengan menara laser di tengah)
Terapkan unlock progression di mana level berikutnya baru terbuka jika level sebelumnya selesai.
```

### Prompt 2.4:
```text
Pada Level 5, buat gameplay aksi edukatif di mana pemain dibekali Pistol Air (Water Gun) untuk menembakkan air ke Menara Pemancar Laser di tengah lapangan hingga HP menara habis dari 8 ke 0. Tambahkan mini-game puzzle 3x3 geser/susun untuk mengisi ulang amunisi air.
```

---

## 📅 Sesi 3: UI/UX Ceria Tanpa Blur, Karakter Faceless SD, & Multiplayer PeerJS
**Waktu:** 15 Oktober 2026 (Siang)  
**Topik:** Refactoring UI Anak, Logo Bulat, & Koneksi P2P HP-Laptop

### Prompt 3.1:
```text
Tolong lakukan refactoring dan penyempurnaan UI/UX pada proyek game Adabku untuk memasang logo secara konsisten, memperjelas visual ceria tanpa blur, serta menerapkan alur onboarding bertahap sesuai spesifikasi lengkap berikut:

1. INTEGRASI LOGO ADABKU:
   - Pasang logo game pada header UI secara konsisten menggunakan public/logo.png (logo bulat) di samping teks 'Adabku'.
   - Tampilkan logo pada Header Landing Screen, Menu Awal, HUD In-Game, Layar Kuis, dan Pause Menu.

2. TAMPILAN AWAL TAJAM & CERIA (NO BLUR BACKGROUND):
   - Buat antarmuka awal bertema warna-warna pastel cerah (biru muda ceria, hijau mint, kuning pastel) yang sangat terang, tajam, dan menarik untuk anak SD.
   - HAPUS seluruh efek backdrop-blur, lapisan transparan buram, atau overlay gelap pada layar awal. Tampilan welcome screen harus kristal jernih, bersih, dan terang benderang.

3. PILIHAN KARAKTER KAPSUL FACELESS (TANPA MAKHLUK BERNYAWA):
   - Karakter murni berupa Model 3D Kapsul Geometris strictly faceless:
     1) Kapsul Laki-laki: 3D Kapsul seragam SD (putih-merah) dengan Peci/Songkok Hitam Polos.
     2) Kapsul Perempuan: 3D Kapsul seragam SD (putih-merah) dengan Jilbab Putih Polos.

4. ALUR PEMBUKAAN BERTAHAP (STEP-BY-STEP KIDS ONBOARDING UI):
   - Langkah 1: Layar Selamat Datang (Landing Screen): Logo 'Adabku' + Tombol Utama [ Siap Belajar & Mainkan ].
   - Langkah 2: Profil & Karakter: Pilihan Kapsul Laki-laki (Peci) vs Perempuan (Jilbab) + Input Nama Panggilan + Tombol [ Lanjut ].
   - Langkah 3: Pilihan Mode Game: [ Single Player ] vs [ Multiplayer ] + Kode Room.
   - Langkah 4: Pemilihan Level: Grid Level 1 s.d. 5 dengan unlock progression.
```

### Prompt 3.2:
```text
Tolong install paket peerjs jika belum ada (npm install peerjs), lalu jalankan ulang dev server Vite menggunakan perintah npm run dev -- --host agar situs game Adabku bisa dibuka kembali di browser.
```

### Prompt 3.3:
```text
Tolong lakukan perbaikan menyeluruh pada modul Multiplayer PeerJS pada proyek game Adabku agar HP dan Laptop bisa saling terhubung dan melihat avatar pemain lain secara real-time:

1. KONFIGURASI PEERJS DENGAN GOOGLE STUN SERVER:
   Tambahkan STUN Server publik Google (stun:stun.l.google.com:19302) saat new Peer() agar WebRTC menembus NAT/Wi-Fi lokal.
2. SISTEM HOST & CLIENT DENGAN KODE ROOM (DEFAULT: ADABKU123):
   Perangkat pertama menjadi Host, perangkat kedua otomatis menjadi Client. Tampilkan status koneksi di HUD (Menghubungkan, Menunggu Pemain, Terhubung).
3. INTERVAL BROADCAST POSISI 3D (20 FPS / 50ms):
   Kirim posisi [x, y, z], rotasi, nama, dan jenis seragam karakter ke seluruh peer yang terhubung.
4. RENDER AVATAR PEMAIN LAIN DI TIGA DIMENSI:
   Render kapsul 3D berpeci atau berjilbab sesuai gender pemain lain dengan 3D Floating Name Tag di atas kepalanya.
```

---

## 📅 Sesi 4: Stabilisasi Build, Touch Drag 360°, & Dokumen Kelayakan Lomba
**Waktu:** 15 Oktober 2026 (Sore)  
**Topik:** Penyelesaian Gerbang Kelayakan, Pembatas Arena, & Ekspor Dokumen

### Prompt 4.1:
```text
Saat menjalankan npm run build, terjadi error memory allocation failed pada compiler Rust/Rolldown Vite 8 karena memori RAM tersisa sedikit. Tolong selesaikan kendala build ini agar bisa dibuild dengan cepat dan stabil.
```

### Prompt 4.2:
```text
Tolong lakukan pembaruan dokumen kelengkapan lomba sekaligus penyempurnaan kode game Adabku secara menyeluruh sesuai spesifikasi lengkap berikut:

BAGIAN 1: PEMBARUAN DOKUMENTASI GERBANG KELAYAKAN (docs/)
1. UPDATE docs/PRD.md & docs/TECH_SPEC.md mencakup 5 level, alur onboarding ceria, karakter kapsul berpeci/jilbab, real-time PeerJS, arena Level 5, dan aturan syariat.
2. BUAT docs/JURNAL_PROMPT.md (5 PROMPT TERKURASI UTAMA: Ide/PRD, Debugging, Audit UI/UX, Finishing, Fitur Tambahan).
3. BUAT docs/LOG_PROMPT_MENTAH.md (Rekapitulasi seluruh riwayat prompt secara kronologis).
4. KONVERSI OTOMATIS KE .docx DAN .pdf (JURNAL_PROMPT.docx dan JURNAL_PROMPT.pdf).

BAGIAN 2: SINKRONISASI FITUR & KODE GAME
1. Integrasi Logo Adabku konsisten pada seluruh header modal dan HUD.
2. Tampilan awal tajam pastel & ceria bebas efek backdrop-blur.
3. Alur 4 langkah onboarding anak SD.
4. Lintasan lurus bersih tanpa rute cabang memutar + unlock progression.
5. Fix PeerJS multiplayer & kontrol sentuh HP touch drag 360°.
6. Pembatas arena tak terlihat (invisible wall box) Level 5 & tembakan pistol air memadamkan Sumber Laser.
7. Syariat compliant: No living beings, no emoji wajah, no BGM, no clapping.
```

---

## 📊 Statistik & Ringkasan Metrik
* **Total Sesi Utama:** 4 Sesi Terstruktur
* **Total Prompt Mentah:** 11 Perintah Prompt Terarah
* **Komponen 3D Utama:** 12 Modul React Three Fiber
* **UI Overlay Components:** 11 Komponen Ceria Ramah Anak
* **Kepatuhan Syariat:** 100% Faceless, No BGM, No Clapping
