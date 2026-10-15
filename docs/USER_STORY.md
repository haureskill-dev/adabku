# 📖 User Story & Requirement Mapping: Adabku
**Dokumentasi Kebutuhan Pengguna, Persona, Skenario Pembelajaran, dan Kriteria Keberhasilan (Acceptance Criteria)**

---

## 1. Persona Pengguna

### Persona 1: Ahmad (Siswa SD Kelas 3, 9 Tahun)
* **Karakteristik:** Gemar bermain game digital, aktif, cepat bosan dengan buku pelajaran teks tebal tanpa gambar.
* **Perangkat:** Tablet Android milik orang tua dan Chromebook di laboratorium komputer sekolah.
* **Kebutuhan:** Game petualangan seru yang tidak membosankan, visual 3D yang keren dan cerah, serta kontrol yang mudah dipahami.
* **Tantangan:** Sering lupa adab harian seperti berbicara keras saat orang tua beribadah, atau terburu-buru ketika masuk ke masjid.

### Persona 2: Aisyah (Siswi SD Kelas 5, 11 Tahun)
* **Karakteristik:** Rajin, menyukai teka-teki, senang bermain bersama teman-temannya (*social learner*).
* **Perangkat:** Smartphone Android.
* **Kebutuhan:** Ingin bermain bersama teman sekelas secara real-time tanpa harus mendaftar akun rumit atau mengunduh aplikasi besar dari App Store.
* **Tantangan:** Ingin media belajar agama yang modern, tidak kaku, dan memiliki tantangan mini-game otak seperti puzzle.

### Persona 3: Ustadz Hilman (Guru PAI SD)
* **Karakteristik:** Pengajar Pendidikan Agama Islam & Budi Pekerti di sekolah dasar, mencari media pembelajaran interaktif untuk Kurikulum Merdeka.
* **Perangkat:** Laptop Windows sekolah dan proyektor kelas.
* **Kebutuhan:** Media ajar berbasis web yang dapat dibuka seketika melalui link tanpa instalasi, bebas dari unsur syubhat/haram (tidak ada gambar berwajah makhluk hidup, tidak ada musik joget), serta memiliki soal-soal studi kasus akhlak yang aplikatif.

---

## 2. Epik & User Stories

### EPISODE 1: Akses Cepat & Orientasi Ramah Anak (Onboarding)
* **US-1.1 [Akses Tanpa Instalasi]:**  
  *Sebagai* siswa SD, *saya ingin* membuka game langsung melalui tautan peramban web di laptop sekolah atau HP, *agar* saya bisa langsung bermain dan belajar tanpa menunggu unduhan puluhan gigabyte atau login kata sandi yang rumit.
  * **Kriteria Keberimaan (AC):**
    * Game berjalan mulus di Google Chrome, Edge, Safari, dan Firefox.
    * Ukuran awal aplikasi ringan dan dapat langsung dimainkan dalam < 3 detik.
* **US-1.2 [Pemilihan Avatar Kapsul Beradab]:**  
  *Sebagai* pemain anak muslim, *saya ingin* memilih karakter kapsul berseragam SD berpeci atau berjilbab sesuai jenis kelamin saya, *agar* saya merasa terwakili dengan busana sopan yang sesuai syariat.
  * **Kriteria Keberimaan (AC):**
    * Tersedia pilihan karakter Siswa Berpeci dan Siswi Berjilbab.
    * Model 3D tampil rapi, cerah, dan *strictly faceless* (tanpa fitur mata/hidung/mulut).

---

### EPISODE 2: Eksplorasi 3D & Pembelajaran Berjenjang (Core Gameplay)
* **US-2.1 [Navigasi Bebas 360 Derajat di Laptop & HP]:**  
  *Sebagai* pemain di laptop, *saya ingin* melihat sekeliling koridor 3D secara leluasa dengan mouse (POV 360°) dan bergerak dengan tombol WASD/Panah, *agar* petualangan terasa nyata dan mengasyikkan.
  * **Kriteria Keberimaan (AC):**
    * Klik ganda atau seret mouse dapat memutar pandangan 360 derajat secara halus.
    * Pada layar sentuh HP/Tablet, muncul kontrol D-Pad dan tombol sentuh virtual besar.
* **US-2.2 [Menghindari Rintangan Perilaku Buruk]:**  
  *Sebagai* pemain yang belajar adab, *saya ingin* menghindari laser rintangan berlabel sifat tercela (misal: "Membentak Orang Tua", "Bercanda Saat Shalat") dengan melompat atau menunduk, *agar* saya paham secara visual bahwa perbuatan tersebut harus dijauhi.
  * **Kriteria Keberimaan (AC):**
    * Laser tinggi dapat dihindari dengan menunduk (`C` / Tombol Tunduk).
    * Laser rendah dapat dihindari dengan melompat (`Spasi` / Tombol Lompat).
    * Jika menabrak, nyawa berkurang 1 hati disertai getaran visual dan petunjuk nasihat adab.

---

### EPISODE 3: Evaluasi Nalar Adab & Teka-Teki (Checkpoints & Mini-Game)
* **US-3.1 [Kuis Studi Kasus Adab]:**  
  *Sebagai* siswa yang ingin menambah poin pahala, *saya ingin* menjawab pertanyaan studi kasus akhlak di setiap checkpoint level, *agar* saya dapat menguji pemahaman perilaku terpuji dalam kehidupan sehari-hari.
  * **Kriteria Keberimaan (AC):**
    * Tersedia tombol pilihan ramah anak: "Boleh / Tidak Boleh" atau "Benar / Salah".
    * Jawaban benar memberikan tambahan 100 koin adab dan audio zikir lembut.
    * Jawaban salah menampilkan dalil/penjelasan ramah anak tanpa menyudutkan pemain.
* **US-3.2 [Mini-Game Puzzle 3x3 Adab]:**  
  *Sebagai* pemain yang mencapai level tinggi, *saya ingin* menyusun potongan gambar acak 3x3 pesan kebaikan melalui sistem geser (*drag & drop*), *agar* melatih konsentrasi dan mengingat pesan adab dengan mendalam.
  * **Kriteria Keberimaan (AC):**
    * Puzzle berukuran 3x3 petak dengan indikator nomor/potongan jelas.
    * Sistem mendeteksi otomatis ketika 9 petak terpasang sempurna dan memberikan kunci pembuka gerbang level.

---

### EPISODE 4: Kolaborasi Belajar Real-Time (Multiplayer P2P)
* **US-4.1 [Bermain Bersama Antar Perangkat]:**  
  *Sebagai* siswa yang berada di lab komputer atau bersama saudara di rumah, *saya ingin* masuk ke ruangan bermain yang sama menggunakan satu kode ruangan (Room Code), *agar* kami bisa melihat posisi karakter teman secara real-time.
  * **Kriteria Keberimaan (AC):**
    * Terhubung seketika menggunakan teknologi WebRTC P2P (PeerJS) tanpa perlu server database berbayar.
    * Avatar kapsul teman terlihat bergerak di layar dengan papan nama (*nametag 3D*) di atasnya.
    * Status koneksi hijau tampil di pojok kanan atas HUD.

---

### EPISODE 5: Puncak Ujian Karakter (Boss Arena Level 5)
* **US-5.1 [Memadamkan Menara Keburukan dengan Pistol Air]:**  
  *Sebagai* pejuang karakter cilik di Level 5, *saya ingin* menembakkan peluru air suci ke arah Menara Laser yang memancarkan sifat-sifat tercela (Sombong, Iri, Dendam), *agar* saya berhasil memadamkan sumber keburukan tersebut.
  * **Kriteria Keberimaan (AC):**
    * Klik kiri atau tombol tembak memunculkan proyektil air 3D dengan trajektori halus.
    * Menara memiliki indikator ketahanan (HP 8) yang berkurang setiap terkena air.
    * Saat menara padam, muncul ucapan kemenangan syariat (*Alhamdulillah, Kamu Berhasil Menjadi Anak Beradab!*).
