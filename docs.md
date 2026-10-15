# 📄 System Docs & AI Agent Guidelines: Adabku (3D Web Game)
**Media Belajar Adab Interaktif Berbasis Web 3D untuk Membentuk Karakter Anak SD**

---

## 1. Project Goal & Overview
Membangun platform permainan edukasi 3D interaktif berbasis web yang dirancang khusus untuk anak Sekolah Dasar (SD). Projek ini bertujuan untuk menanamkan pemahaman adab harian (menghormati orang tua, batasan penggunaan HP/gadget, dan kedisiplinan ibadah) melalui media visual yang menarik, menyenangkan, serta aman secara syariat Islam.

---

## 2. Tech Stack & Architecture
- **Framework & Build Tool:** React.js / Vite
- **3D Engine:** Three.js / React Three Fiber (R3F)
- **Styling & UI Overlay:** Tailwind CSS (Skema warna cerah, ramah anak, tombol besar)
- **State Management:** React Context API / Zustand
- **Deployment Target:** Vercel (Responsive Web)

---

## 3. Core Features & Functional Scope

### A. 3D Visual & Character (Syariat Compliant)
- Karakter utama berbentuk **3D Stickman / Objek Geometri Minimalis** (tanpa penggambaran detail wajah/makhluk bernyawa untuk menjaga batasan syariat).
- Arena & lintasan petualangan 3D yang dinamis, bersih, dan penuh warna yang disukai anak SD.

### B. Obstacle & Pergerakan Kontrol
- Karakter dikontrol penuh secara manual oleh pemain (tidak berlari otomatis).
- Pemain dapat menggerakkan karakter ke **Maju**, **Mundur**, **Kanan**, dan **Kiri**, serta melakukan gerakan **Melompat (Jump)** atau **Menunduk (Crouch)**.
- Rintangan berupa **Tembakan Laser Merah Melayang** yang membawa label tindakan buruk (contoh: *"Membentak Orang Tua"*, *"Main HP Lupa Waktu"*, *"Menonton Tontonan Buruk"*).

### C. Checkpoint Kuis Adab (Interactive Pause & Learn)
- Di area lintasan tertentu, game menampilkan layar pop-up kuis interaktif dengan 2 variasi format tombol sesuai tipe pertanyaan:
  1. **Tipe Studi Kasus Perilaku:** Tombol opsi **[ BOLEH ]** atau **[ TIDAK BOLEH ]**.
  2. **Tipe Pernyataan/Prinsip Adab:** Tombol opsi **[ BENAR ]** atau **[ SALAH ]**.
- **Jawaban Benar:** Mendapat Perisai Adab / bonus poin.
- **Jawaban Salah:** Penjelasan edukatif singkat yang ramah anak.

### D. Fitur Tombol Pause Ber-Adab
- Tombol `⏸️` di layar UI dan tombol shortcut `ESC` / `P` pada keyboard.
- Saat di-pause, game membekukan animasi 3D dan menampilkan pesan pengingat adab:  
  *"Dahulukan panggilan orang tua dan waktu shalat! Yuk terapkan Adab dalam kehidupan nyata"*

### E. Responsive Controls & Score System
- **Desktop/Laptop:** Keyboard (WASD / Tombol Panah untuk pergerakan Maju/Mundur/Kanan/Kiri, Space untuk Melompat, Ctrl/Shift untuk Menunduk).
- **Mobile/Tablet:** *Virtual D-Pad/Joystick* dan tombol tindakan di layar sentuh.
- **Leaderboard & Rekap:** Papan skor berbasis poin adab dan waktu tempuh eksplorasi.

---

## 4. AI Coding Rules & Conventions (System Prompt)

Saat berinteraksi dengan AI Agent (Cursor / Antigravity / IDE AI lainnya), AI wajib mematuhi aturan penulisan kode berikut:

1. **Modular Architecture:** Tulis komponen React dan modul Three.js secara terpisah dan rapi (pisahkan logika 3D Canvas, UI Overlay, dan State Kuis).
2. **Performance First:** Pastikan animasi Three.js berjalan lancar di 60 FPS baik pada perangkat mobile maupun desktop.
3. **Child-Friendly UX/UI:** Gunakan tata letak UI yang intuitif, kontras warna yang nyaman di mata anak, serta kontrol yang responsif.
4. **Self-Correction & Documentation:** Setiap kali melakukan perbaikan bug atau refactoring kode, AI wajib memberikan penjelasan ringkas pada log perubahan.