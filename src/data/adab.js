// Label perilaku buruk tematik sesuai tingkat level (Level 1 s.d. 5)
export const LEVEL_BAD_DEEDS = {
  1: [
    'Berlari Saat Orang Shalat',
    'Bicara Keras Saat Khutbah',
    'Main HP Saat Adzan',
    'Lewat di Depan Orang Shalat',
  ],
  2: [
    'Membentak Orang Tua',
    'Main Game Lupa Waktu',
    'Masuk Kamar Tanpa Salam',
    'Meninggalkan Piring Kotor',
  ],
  3: [
    'Mencontek Saat Ujian',
    'Menjahili Teman',
    'Datang Terlambat',
    'Membuang Sampah Sembarangan',
  ],
  4: [
    'Merusak Tanaman',
    'Membuang Sampah di Hutan',
    'Mencabut Bunga Sembarangan',
    'Mengganggu Kelestarian Alam',
  ],
  5: [
    'Sombong',
    'Riya',
    'Berbohong',
    'Iri Hati',
    'Fitnah',
    'Suka Marah',
    'Dendam',
  ],
}

export const getBadDeedsForLevel = (level = 1) =>
  LEVEL_BAD_DEEDS[level] || LEVEL_BAD_DEEDS[1]

// Backward compatibility
export const BAD_DEEDS = LEVEL_BAD_DEEDS[1]

/**
 * Struktur Kurikulum Adab Anak SD per 5 Level (Sesuai Urutan Baru):
 * - Level 1 (Goal: Masjid): Adab mendahulukan Allah, masuk masjid, shalat, dan ketenangan di dalam masjid.
 * - Level 2 (Goal: Rumah): Adab kepada Ibu, Ayah, Kakak, Adik, serta Tetangga.
 * - Level 3 (Goal: Sekolah): Naik sepeda menuju sekolah, adab kepada Guru, Teman, dan menjaga kebersihan sekolah.
 * - Level 4 (Goal: Hutan & Alam): Adab menyayangi tanaman, menjaga kebersihan alam, dan tidak merusak lingkungan (bebas avatar hewan bernyawa).
 * - Level 5 (Goal: Arena Terbuka & Sumber Laser / LEVEL TERAKHIR): Arena terbuka dengan Laser Emitter Tower, Puzzle 3x3, dan pistol air.
 */
export const LEVELS_CONFIG = {
  1: {
    id: 1,
    name: 'Level 1: Menuju Masjid',
    goal: 'Masjid',
    subtitle: 'Mendahulukan Allah, Adab Masuk Masjid & Shalat',
    trackLength: 200,
    checkpoints: [-40, -80, -120, -160],
    quizzes: [
      {
        type: 'kasus',
        question: 'Adzan berkumandang saat kamu sedang bermain. Bolehkah kamu segera berwudhu dan bersiap shalat?',
        answer: true,
        explanation: 'Masya Allah! Shalat tepat waktu adalah amalan yang paling dicintai Allah.',
        illustration: 'masjid_adzan',
      },
      {
        type: 'prinsip',
        question: 'Saat melangkah masuk ke dalam masjid, kita disunnahkan mendahulukan kaki kanan dan berdoa.',
        answer: true,
        explanation: 'Benar! Membaca doa: "Allahummaftah lii abwaaba rahmatik" (Ya Allah, bukalah pintu rahmat-Mu untukku).',
        illustration: 'masjid_kaki_kanan',
      },
      {
        type: 'kasus',
        question: 'Bolehkah berteriak atau berlari-larian mengejar teman di dalam ruang shalat masjid?',
        answer: false,
        explanation: 'Masjid adalah tempat ibadah yang suci dan tenang. Kita harus menjaga ketenangan jamaah lain.',
        illustration: 'masjid_tenang',
      },
      {
        type: 'prinsip',
        question: 'Shalat Tahiyyatul Masjid dua rakaat dianjurkan sebelum kita duduk di dalam masjid.',
        answer: true,
        explanation: 'Tepat sekali! Ini adalah bentuk penghormatan dan adab saat memasuki rumah Allah.',
        illustration: 'masjid_shalat',
      },
    ],
  },
  2: {
    id: 2,
    name: 'Level 2: Menuju Rumah',
    goal: 'Rumah',
    subtitle: 'Adab Berbakti Kepada Ibu & Ayah, Sayang Saudara & Tetangga',
    trackLength: 200,
    checkpoints: [-40, -80, -120, -160],
    quizzes: [
      {
        type: 'prinsip',
        question: 'Mengucapkan kata "Ah" atau membentak Ibu dan Ayah saat disuruh merapikan kamar adalah hal yang dilarang agama.',
        answer: true,
        explanation: 'Betul! Allah melarang kita membentak orang tua dan memerintahkan kita bertutur kata mulia (QS. Al-Isra: 23).',
        illustration: 'rumah_bakti_ortu',
      },
      {
        type: 'kasus',
        question: 'Adikmu ingin meminjam pensil warnamu. Bolehkah kamu meminjamkannya dengan tersenyum dan ikhlas?',
        answer: true,
        explanation: 'Masya Allah! Menyayangi yang lebih muda dan menghormati yang lebih tua adalah adab mulia dalam keluarga.',
        illustration: 'rumah_sayang_adik',
      },
      {
        type: 'kasus',
        question: 'Bolehkah menyalakan musik atau TV sangat keras di rumah hingga mengganggu tetangga yang sedang istirahat?',
        answer: false,
        explanation: 'Rasulullah ﷺ berpesan agar kita tidak mengganggu tetangga. Berbuat baiklah kepada tetangga terdekat.',
        illustration: 'rumah_adab_tetangga',
      },
      {
        type: 'prinsip',
        question: 'Sebelum masuk ke rumah orang lain atau mengetuk pintu kamar orang tua, kita wajib mengucapkan salam dan meminta izin.',
        answer: true,
        explanation: 'Tepat sekali! Adab meminta izin dan mengucapkan salam menjaga kehormatan dan kenyamanan keluarga.',
        illustration: 'rumah_izin_salam',
      },
    ],
  },
  3: {
    id: 3,
    name: 'Level 3: Menuju Sekolah',
    goal: 'Sekolah',
    subtitle: 'Adab Kepada Guru, Teman & Kebersihan Sekolah',
    trackLength: 200,
    checkpoints: [-40, -80, -120, -160],
    quizzes: [
      {
        type: 'kasus',
        question: 'Kamu berpapasan dengan bapak/ibu guru di gerbang sekolah. Bolehkah mengucap salam dan menyapa beliau dengan sopan?',
        answer: true,
        explanation: 'Hebat! Menghormati guru adalah kunci keberkahan ilmu yang kita pelajari.',
        illustration: 'sekolah_salam_guru',
      },
      {
        type: 'prinsip',
        question: 'Mengejek atau memanggil teman dengan julukan yang tidak disukai adalah hal yang dilarang agama.',
        answer: true,
        explanation: 'Allah melarang kita saling memanggil dengan panggilan buruk (QS. Al-Hujurat: 11). Selalu panggil teman dengan nama baiknya.',
        illustration: 'sekolah_sayang_teman',
      },
      {
        type: 'kasus',
        question: 'Saat guru sedang menjelaskan pelajaran di depan kelas, bolehkah kamu mengobrol sendiri dengan teman sebangku?',
        answer: false,
        explanation: 'Dengarkan penjelasan guru dengan seksama dan penuh adab agar ilmu mudah dipahami.',
        illustration: 'sekolah_tertib_kelas',
      },
      {
        type: 'prinsip',
        question: 'Menjaga kebersihan meja, membuang bungkus makanan ke tempat sampah, dan merapikan buku adalah cermin adab seorang penuntut ilmu.',
        answer: true,
        explanation: 'Benar! "Kebersihan adalah sebagian dari iman". Lingkungan bersih membuat belajar jadi nyaman.',
        illustration: 'sekolah_kebersihan',
      },
    ],
  },
  4: {
    id: 4,
    name: 'Level 4: Hutan & Alam',
    goal: 'Hutan Asri',
    subtitle: 'Adab Merawat Tumbuhan, Menjaga Kebersihan Alam & Lingkungan',
    trackLength: 200,
    checkpoints: [-40, -80, -120, -160],
    quizzes: [
      {
        type: 'kasus',
        question: 'Saat melihat tanaman hias di halaman mulai layu dan kering, bolehkah kamu menyiramnya dengan air agar kembali segar?',
        answer: true,
        explanation: 'Masya Allah! Menjaga dan merawat tumbuhan bernilai pahala sedekah di sisi Allah.',
        illustration: 'alam_rawat_tanaman',
      },
      {
        type: 'prinsip',
        question: 'Memetik bunga di taman umum atau mematahkan ranting pohon sembarangan adalah perbuatan yang dilarang karena merusak lingkungan.',
        answer: true,
        explanation: 'Benar! Islam mengajarkan kita melestarikan tanaman dan tidak berbuat kerusakan di muka bumi.',
        illustration: 'alam_lindung_pohon',
      },
      {
        type: 'kasus',
        question: 'Bolehkah membuang sampah plastik atau bekas bungkus makanan ke aliran sungai dan selokan air?',
        answer: false,
        explanation: 'Membuang sampah ke sungai dapat mencemari air dan menyebabkan banjir. Buanglah selalu pada tempat sampah.',
        illustration: 'alam_jaga_sungai',
      },
      {
        type: 'prinsip',
        question: 'Menyingkirkan duri, batu, atau ranting pohon yang menghalangi jalan orang lain bernilai sedekah di sisi Allah.',
        answer: true,
        explanation: 'Tepat sekali! Menyingkirkan gangguan dari jalan adalah salah satu cabang keimanan yang mulia.',
        illustration: 'alam_bersih_jalan',
      },
    ],
  },
  5: {
    id: 5,
    name: 'Level 5: Arena Sumber Laser',
    goal: 'Padamkan Sumber Laser',
    subtitle: 'Misi Pamungkas: Kumpulkan Butiran Soal, Selesaikan Puzzle 3x3 & Tembak Laser Tower dengan Pistol Air!',
    isArena: true,
    towerMaxHp: 8,
  },
}

/**
 * Bank Soal Khusus Level 5 Arena:
 * Berisi kombinasi Variasi 1 (Soal Teks Bergambar Faceless) dan Variasi 2 (Puzzle 3x3 Interaktif).
 */
export const LEVEL_5_ORBS = [
  {
    id: 'orb-1',
    kind: 'quiz',
    x: -12,
    z: -10,
    type: 'prinsip',
    title: 'Adab Berdoa & Tawakal',
    question: 'Memulai setiap kebaikan dengan Bismillah dan mengakhirinya dengan Alhamdulillah adalah wujud syukur kepada Allah.',
    answer: true,
    explanation: 'Benar! Setiap urusan baik yang dimulai dengan asma Allah akan mendatangkan berkah.',
    category: 'Adab Mengingat Allah',
    illustration: 'arena_doa_syukur',
  },
  {
    id: 'orb-2',
    kind: 'puzzle',
    x: 12,
    z: -12,
    title: 'Puzzle Adab 3x3: Membantu Orang Tua',
    puzzleImage: 'puzzle_adab_ortu',
    followUpQuestion: 'Setelah menyusun puzzle ini, perilaku adab mulia apakah yang dicontohkan pada gambar?',
    options: [
      { text: 'Membantu Ibu merapikan belanjaan dengan ceria', correct: true },
      { text: 'Bermain game dan mengabaikan panggilan Ibu', correct: false },
      { text: 'Meminta uang jajan dengan merajuk', correct: false },
    ],
    explanation: 'Alhamdulillah! Berbakti dan meringankan beban orang tua mendatangkan ridho Allah.',
  },
  {
    id: 'orb-3',
    kind: 'quiz',
    x: -14,
    z: 11,
    type: 'kasus',
    title: 'Adab Kejujuran',
    question: 'Saat kamu tidak sengaja memecahkan piring, bolehkah kamu mengakui kesalahan dan meminta maaf dengan jujur?',
    answer: true,
    explanation: 'Masya Allah! Kejujuran menuntun pada kebaikan, dan kebaikan menuntun ke surga.',
    category: 'Adab Kejujuran',
    illustration: 'arena_jujur',
  },
  {
    id: 'orb-4',
    kind: 'puzzle',
    x: 13,
    z: 12,
    title: 'Puzzle Adab 3x3: Berbagi Makanan',
    puzzleImage: 'puzzle_berbagi',
    followUpQuestion: 'Setelah menyusun puzzle ini, adab apa yang sedang dilakukan pada gambar?',
    options: [
      { text: 'Berbagi bekal makanan sehat kepada teman yang tidak membawa', correct: true },
      { text: 'Menghabiskan makanan sendirian sambil pamer', correct: false },
      { text: 'Membuang makanan sisa ke selokan', correct: false },
    ],
    explanation: 'Masya Allah! Berbagi makanan mempererat silaturahmi dan menumbuhkan rasa kasih sayang.',
  },
  {
    id: 'orb-5',
    kind: 'quiz',
    x: 0,
    z: -16,
    type: 'prinsip',
    title: 'Adab Menahan Amarah',
    question: 'Rasulullah ﷺ mengajarkan jika kita sedang marah, hendaknya kita diam, membaca taawudz, dan mengambil air wudhu.',
    answer: true,
    explanation: 'Tepat sekali! Air wudhu memadamkan amarah laksana air memadamkan api.',
    category: 'Adab Menahan Emosi',
    illustration: 'arena_padam_amarah',
  },
  {
    id: 'orb-6',
    kind: 'puzzle',
    x: 0,
    z: 17,
    title: 'Puzzle Adab 3x3: Shalat Berjamaah',
    puzzleImage: 'puzzle_shalat',
    followUpQuestion: 'Adab apakah yang dicerminkan dalam gambar puzzle yang telah kamu susun?',
    options: [
      { text: 'Merapikan dan meluruskan shaf saat shalat berjamaah', correct: true },
      { text: 'Bercanda dan saling dorong saat shalat', correct: false },
      { text: 'Mendahului gerakan imam saat ruku dan sujud', correct: false },
    ],
    explanation: 'Lurus dan rapatnya shaf shalat adalah bagian dari kesempurnaan shalat berjamaah.',
  },
]

export const LEVEL_4_ORBS = LEVEL_5_ORBS

export const QUIZ_OPTIONS = {
  kasus: { yes: 'BOLEH', no: 'TIDAK BOLEH', badge: 'Studi Kasus' },
  prinsip: { yes: 'BENAR', no: 'SALAH', badge: 'Prinsip Adab' },
}
