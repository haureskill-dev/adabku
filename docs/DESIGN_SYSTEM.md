# 🎨 Design System Document (DESIGN_SYSTEM): Adabku
**Panduan Visual, Identitas Brand, Karakter 3D Syariat, & Standar Antarmuka Ramah Anak SD**

---

## 1. Identitas Brand & Filosofi Visual

### 1.1 Visi Desain
Adabku dirancang sebagai media belajar pendidikan karakter dan adab harian Islam untuk anak Sekolah Dasar (usia 6–12 tahun). Pendekatan visual mengedepankan suasana **ceria, jernih, bersih, dan berwibawa**, menjauhkan kesan kaku dari materi agama tanpa mengurangi kekhidmatan nilai syariat.

### 1.2 Logo Resmi Adabku
* **Simbol Inti:** Tunas pohon hijau 3D yang tumbuh merekah berdaun tiga di atas tanah subur bergradasi emas, melambangkan pertumbuhan adab sejak usia dini.
* **Latar Belakang:** Lingkaran bulat bergradasi Zamrud (*Emerald Green*) dengan sentuhan ornamen kubah geometris halus.
* **Tipografi Logo:** Huruf timbul 3D berwarna emas (*Golden Sun*) dengan teks *Adabku* yang membulat dan bersahabat.
* **Format & Lokasi:** Ditampilkan konsisten di header permainan, modul awal, serta layar pause (`public/logo.png`).

---

## 2. Palet Warna (Color Palette)

Palet warna Adabku dikurasi secara harmonis dengan kontras tinggi (WCAG AA compliant) agar teks dan elemen interaktif terbaca jelas di berbagai layar gawai anak sekolah:

| Token Warna | Nilai Hex | Peran & Penggunaan | Kesan Psikologis |
| :--- | :---: | :--- | :--- |
| **Emerald Prime** | `#047857` / `#059669` | Warna primer header, tombol aksi utama, border kartu | Kedamaian Islami, keteduhan, kesejukan |
| **Mint Fresh** | `#10b981` / `#a7f3d0` | Aksen keberhasilan, status benar, latar kartu kuis | Kecerahan, kesegaran anak-anak |
| **Merah SD** | `#dc2626` / `#ef4444` | Celana/rok karakter kapsul SD, peringatan rintangan laser | Keakraban seragam sekolah Indonesia, kewaspadaan |
| **Golden Amber** | `#f59e0b` / `#fbbf24` | Skor, bintang pencapaian, koin pahala, highlight kuis | Semangat berprestasi, kehangatan, kegembiraan |
| **Sky Cyan** | `#0284c7` / `#38bdf8` | Efek pistol air pemadam keburukan, ornamen suci masjid | Kesucian air, kejernihan niat, keceriaan |
| **Pure Canvas** | `#ffffff` / `#f8fafc` | Latar panel modal, kartu soal, panel status HUD | Kejernihan pandangan, keterbacaan maksimal tanpa blur |
| **Dark Slate** | `#0f172a` / `#1e293b` | Teks utama, label nama pemain, tombol bayangan | Kontras tajam, keterbacaan tinggi di segala latar |

---

## 3. Tipografi (Typography)

* **Font Judul & Header Display:** `Baloo 2`, `Fredoka`, sans-serif.
  * Karakter huruf membulat (*rounded curves*), tebal, dan ramah anak.
  * Menghilangkan kesan formalitas yang membosankan bagi siswa SD.
* **Font Teks Utama & Soal Kuis:** `Nunito`, `Quicksand`, `Arial`, sans-serif.
  * Keterbacaan tinggi (*high legibility*) dengan jarak antar huruf proporsional.
  * Ukuran font minimum pada layar ponsel: 14px (body), 18px (tombol), 22px (judul kartu).

---

## 4. Standar Visual 3D & Kepatuhan Penuh Syariat Islam

Salah satu keunggulan terbesar Adabku yang menjadi instruksi acuan baku bagi AI Agent adalah **kepatuhan total pada syariat Islam**:

### 4.1 Prinsip *Strictly Faceless* (Tanpa Wajah Makhluk Bernyawa)
* **Karakter Kapsul Geometris:** Karakter pemain dan avatar teman diwujudkan dalam bentuk kapsul 3D bertekstur kain seragam SD yang halus dan proporsional.
* **Bebas Fitur Wajah:** Sama sekali tidak memiliki mata, hidung, mulut, telinga, maupun alis. 
* **Kepala Halus Berwarna Peach:** Menggunakan material peach alami (`#fcd34d` / `#fed7aa`) polos tanpa garis wajah apapun.

### 4.2 Desain Karakter Khas Siswa Indonesia
1. **Karakter Kapsul Laki-laki (Ahmad):**
   * **Peci / Songkok Hitam:** Tabung geometris hitam legam (`#111827`) di atas kepala kapsul, melambangkan identitas muslim Indonesia yang rapi.
   * **Baju:** Kemeja putih berkerah dengan saku dada merah.
   * **Bawahan:** Celana panjang merah khas seragam SD negeri.
2. **Karakter Kapsul Perempuan (Aisyah):**
   * **Jilbab Putih Syar'i:** Bentuk kerudung putih halus (`#f8fafc`) yang menutup bagian atas kepala hingga bahu secara anggun dan rapi.
   * **Baju:** Kemeja putih panjang.
   * **Bawahan:** Rok panjang merah khas seragam SD negeri.

### 4.3 Kebijakan Audio Syariat (*No BGM & No Clapping*)
* **Tanpa Musik Latar (No BGM):** Tidak menggunakan aransemen instrumen musik yang melalaikan.
* **Tanpa Suara Tepuk Tangan:** Sesuai bimbingan adab Islami, ucapan selamat diganti dengan pujian zikir (*Masya Allah, Tabarakallah, Alhamdulillah*).
* **Audio Sintetis Lembut (Web Audio API):** Menggunakan frekuensi osilator murni untuk lonceng lembut, efek cipratan air sejuk, dan notifikasi kuis yang ramah telinga anak.

---

## 5. Komponen Antarmuka Pengguna (UI Components)

### 5.1 Kebijakan Anti-Blur (Crystal Clear UI)
Seluruh lapisan antarmuka pengguna dibangun **bebas dari filter `backdrop-blur` pekat**. Hal ini menjaga dua aspek penting:
1. **Kejelasan Visual:** Mata anak-anak tidak cepat lelah akibat teks berbayang atau kabur.
2. **Performa Ringan:** Mengurangi beban GPU hingga 40% pada laptop sekolah bertipe Chromebook atau HP berspesifikasi rendah.

### 5.2 Kartu & Tombol Aksi (Buttons & Cards)
* **Sudut Membulat:** Menggunakan `rounded-2xl` hingga `rounded-3xl` yang ramah anak.
* **Border Tegas & Berwarna:** Garis tepi 2px hingga 4px dengan warna kontras (misal: `border-emerald-300`).
* **Micro-Interactions Ceria:** Efek hover `hover:scale-105 active:scale-95` yang memberikan respon sentuhan responsif seperti mainan nyata.

### 5.3 Onboarding Berjenjang 4 Langkah
1. **Layar Pembuka (Welcome Screen):** Menampilkan logo Adabku besar dan tombol utama tunggal.
2. **Pilih Karakter & Nama:** Memilih kapsul Putra/Putri dan mengetik nama panggilan.
3. **Pilih Mode Permainan:** Tombol besar Single Player vs Multiplayer P2P.
4. **Pilih Level:** Peta level berurutan dengan indikator gembok pada level yang belum dibuka.

### 5.4 Heads-Up Display (HUD) Responsif
* **Pojok Kiri Atas:** Bar nyawa (Hati Merah), Perisai Adab (Biru Muda), dan Indikator Skor Berbintang.
* **Pojok Kanan Atas:** Tombol Bantuan Adab, Tombol Jeda (Pause), dan Status Jaringan Multiplayer P2P.
* **Pusat Layar:** Crosshair titik bidik halus saat berada di Level 5 (Arena Air) dan teks peringatan adab buruk saat melintasi laser.
* **Bawah Layar (Mobile):** Virtual D-Pad transparan untuk navigasi sentuh serta tombol Lompat & Menunduk berukuran besar.
