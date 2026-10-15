/**
 * Ilustrasi Edukasi Adab Syariat-Compliant (Strictly Faceless: Polos Tanpa Mata, Hidung, atau Mulut).
 * Didesain modern, bersih, ramah anak, dan bebas dari unsur makhluk bernyawa yang terlarang.
 * Setiap level (1 s.d. 5) memiliki ilustrasi tematik yang seragam gayanya dan relevan dengan butir soal.
 */

export function FacelessPerson({
  color = '#38bdf8',
  skin = '#fed7aa',
  headY = 24,
  scale = 1,
  isGirl = false,
  isMother = false,
}) {
  return (
    <g transform={`scale(${scale})`}>
      {/* Kepala Bulat Polos (Strictly Faceless - Tanpa Mata, Hidung, Mulut) */}
      <circle cx="50" cy={headY} r="14" fill={skin} />

      {/* Jilbab / Peci / Rambut Stylized Polos */}
      {isMother ? (
        <path
          d={`M32 ${headY - 6} C32 ${headY - 18} 68 ${headY - 18} 68 ${headY - 6} C68 ${headY + 16} 62 ${headY + 28} 50 ${headY + 28} C38 ${headY + 28} 32 ${headY + 16} 32 ${headY - 6} Z`}
          fill="#059669"
        />
      ) : isGirl ? (
        <path
          d={`M33 ${headY - 4} C33 ${headY - 16} 67 ${headY - 16} 67 ${headY - 4} C67 ${headY + 14} 62 ${headY + 24} 50 ${headY + 24} C38 ${headY + 24} 33 ${headY + 14} 33 ${headY - 4} Z`}
          fill="#f472b6"
        />
      ) : (
        /* Peci / Kopiah Hitam Bersih */
        <path
          d={`M36 ${headY - 6} C36 ${headY - 14} 64 ${headY - 14} 64 ${headY - 6} L64 ${headY - 1} L36 ${headY - 1} Z`}
          fill="#18181b"
        />
      )}

      {/* Badan Baju Kapsul Halus */}
      <path
        d={`M30 ${headY + 20} C30 ${headY + 14} 70 ${headY + 14} 70 ${headY + 20} L74 ${headY + 54} C74 ${headY + 58} 26 ${headY + 58} 26 ${headY + 54} Z`}
        fill={color}
      />
    </g>
  )
}

export default function FacelessIllustration({ type = 'masjid_adzan', className = 'w-full h-44' }) {
  switch (type) {
    /* ====================================================================
       LEVEL 1: MENUJU MASJID (Adab Shalat, Masuk Masjid, Suasana Khusyuk)
       ==================================================================== */
    case 'masjid_adzan':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdf4" rx="16" />
          <rect y="145" width="300" height="55" fill="#bbf7d0" />
          {/* Kubah Masjid Hijau Pastel */}
          <path d="M150 55 C115 55 100 110 100 150 L200 150 C200 110 185 55 150 55 Z" fill="#10b981" />
          <circle cx="150" cy="45" r="8" fill="#facc15" />
          <path d="M150 32 L150 45" stroke="#facc15" strokeWidth="3" />
          {/* Menara Masjid Minimalis */}
          <rect x="65" y="80" width="22" height="70" rx="3" fill="#34d399" />
          <path d="M62 80 L88 80 L76 60 Z" fill="#059669" />
          <rect x="213" y="80" width="22" height="70" rx="3" fill="#34d399" />
          <path d="M210 80 L236 80 L224 60 Z" fill="#059669" />
          {/* Pintu Gerbang Masjid Melengkung */}
          <path d="M135 150 C135 125 165 125 165 150 Z" fill="#064e3b" />
          {/* Gelombang Suara Adzan Berpendar */}
          <path d="M48 65 Q 35 75 48 85" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M40 55 Q 22 75 40 95" stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      )

    case 'masjid_kaki_kanan':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#ecfdf5" rx="16" />
          {/* Lantai Teras Marmer & Karpet Hijau */}
          <rect y="120" width="140" height="80" fill="#e2e8f0" />
          <rect x="140" y="120" width="160" height="80" fill="#059669" />
          {/* Sandal Tertata Rapi di Luar */}
          <rect x="30" y="145" width="22" height="38" rx="11" fill="#3b82f6" />
          <rect x="58" y="145" width="22" height="38" rx="11" fill="#3b82f6" />
          {/* Ambang Pintu Masjid Masuk Kaki Kanan */}
          <line x1="140" y1="20" x2="140" y2="200" stroke="#10b981" strokeWidth="6" />
          {/* Jejak Kaki Kanan Masuk Duluan Berpendar Kuning */}
          <g transform="translate(170, 135)">
            <ellipse cx="20" cy="22" rx="12" ry="18" fill="#fef08a" />
            <circle cx="20" cy="5" r="4" fill="#fef08a" />
            <circle cx="27" cy="8" r="3" fill="#fef08a" />
            <circle cx="13" cy="8" r="3" fill="#fef08a" />
          </g>
          {/* Kaligrafi Geometris Berkah */}
          <circle cx="220" cy="65" r="30" fill="#10b981" opacity="0.15" />
          <path d="M210 65 L230 65 M220 55 L220 75" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )

    case 'masjid_tenang':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdf4" rx="16" />
          {/* Pilar-pilar Masjid Putih Bersih */}
          <rect x="40" y="40" width="20" height="160" rx="4" fill="#ffffff" />
          <rect x="240" y="40" width="20" height="160" rx="4" fill="#ffffff" />
          <path d="M40 40 Q 150 10 260 40" stroke="#ffffff" strokeWidth="12" fill="none" />
          {/* Karpet Hijau Shaf Damai */}
          <rect y="140" width="300" height="60" fill="#047857" />
          <line x1="0" y1="170" x2="300" y2="170" stroke="#fef08a" strokeWidth="3" strokeDasharray="8 6" />
          {/* Simbol Ketenangan Khusyuk (Lampu Gantung Masjid Lembut) */}
          <line x1="150" y1="10" x2="150" y2="70" stroke="#d97706" strokeWidth="2" />
          <circle cx="150" cy="85" r="16" fill="#fef08a" />
          <path d="M140 85 Q 150 105 160 85 Z" fill="#eab308" />
        </svg>
      )

    case 'masjid_shalat':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#ecfdf5" rx="16" />
          <rect y="130" width="300" height="70" fill="#10b981" />
          {/* Sajadah Hijau Bersulam Kubah */}
          <g transform="translate(100, 75)">
            <rect width="100" height="110" rx="8" fill="#047857" />
            <path d="M20 90 L20 40 C20 18 80 18 80 40 L80 90 Z" fill="#065f46" />
            <line x1="0" y1="110" x2="100" y2="110" stroke="#facc15" strokeWidth="4" strokeDasharray="4 4" />
          </g>
          {/* Rekal & Mushaf Al-Qur'an Faceless */}
          <g transform="translate(125, 110)">
            {/* Rekal Kayu Menyilang */}
            <path d="M10 30 L40 10 M40 30 L10 10" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
            {/* Mushaf Terbuka */}
            <path d="M12 10 Q 25 16 38 10 Q 38 5 25 11 Q 12 5 12 10 Z" fill="#f8fafc" stroke="#059669" strokeWidth="1.5" />
          </g>
        </svg>
      )

    /* ====================================================================
       LEVEL 2: MENUJU RUMAH (Adab Berbakti, Sayang Keluarga, Izin Salam)
       ==================================================================== */
    case 'rumah_bakti_ortu':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#fffbeb" rx="16" />
          <rect y="140" width="300" height="60" fill="#fde68a" />
          {/* Kamar / Ruang Rumah Rapi */}
          <rect x="40" y="50" width="70" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="75" y1="50" x2="75" y2="110" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="40" y1="80" x2="110" y2="80" stroke="#cbd5e1" strokeWidth="2" />
          {/* Anak Merapikan Kamar & Baju - Strictly Faceless */}
          <g transform="translate(150, 40)">
            <circle cx="50" cy="40" r="15" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#0284c7" />
            {/* Keranjang Pakaian Rapi */}
            <rect x="70" y="85" width="40" height="32" rx="6" fill="#d97706" />
            <rect x="75" y="78" width="30" height="10" rx="3" fill="#ffffff" />
          </g>
        </svg>
      )

    case 'rumah_sayang_adik':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#fdf2f8" rx="16" />
          <rect y="145" width="300" height="55" fill="#fbcfe8" />
          {/* Meja Belajar Rumah Bersama */}
          <rect x="70" y="115" width="160" height="40" rx="6" fill="#d97706" />
          {/* Pensil Warna & Buku Gambar Bersama */}
          <rect x="130" y="105" width="40" height="20" rx="3" fill="#ffffff" stroke="#ec4899" strokeWidth="2" />
          <rect x="115" y="108" width="10" height="15" rx="2" fill="#3b82f6" />
          <rect x="175" y="108" width="10" height="15" rx="2" fill="#eab308" />
          {/* Kakak (Kiri) & Adik (Kanan) - Strictly Faceless */}
          <g transform="translate(30, 45)">
            <circle cx="50" cy="38" r="15" fill="#fed7aa" />
            <path d="M35 32 C35 20 65 20 65 32 L65 37 L35 37 Z" fill="#18181b" />
            <path d="M28 62 C28 55 72 55 72 62 L75 110 C75 112 25 112 25 110 Z" fill="#3b82f6" />
          </g>
          <g transform="translate(175, 60)">
            <circle cx="50" cy="38" r="12" fill="#fed7aa" />
            <path d="M38 34 C38 24 62 24 62 34 L62 38 L38 38 Z" fill="#ec4899" />
            <path d="M32 58 C32 52 68 52 68 58 L70 95 C70 98 30 98 30 95 Z" fill="#f43f5e" />
          </g>
        </svg>
      )

    case 'rumah_adab_tetangga':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdf4" rx="16" />
          <rect y="145" width="300" height="55" fill="#86efac" />
          {/* Dua Rumah Berdampingan Hangat & Asri */}
          <g transform="translate(35, 60)">
            <polygon points="40,10 10,40 70,40" fill="#f97316" />
            <rect x="15" y="40" width="50" height="50" fill="#f8fafc" />
            <rect x="32" y="60" width="16" height="30" fill="#78350f" />
          </g>
          <g transform="translate(185, 60)">
            <polygon points="40,10 10,40 70,40" fill="#3b82f6" />
            <rect x="15" y="40" width="50" height="50" fill="#f8fafc" />
            <rect x="32" y="60" width="16" height="30" fill="#78350f" />
          </g>
          {/* Pagar Kayu Rounded di Antara Rumah */}
          <line x1="105" y1="135" x2="185" y2="135" stroke="#78350f" strokeWidth="4" />
          <line x1="120" y1="125" x2="120" y2="148" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="145" y1="125" x2="145" y2="148" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="170" y1="125" x2="170" y2="148" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          {/* Hati Kasih Sayang Antar Tetangga */}
          <circle cx="145" cy="80" r="14" fill="#f43f5e" />
          <path d="M145 74 Q 150 68 154 74 Q 154 80 145 88 Q 136 80 136 74 Q 140 68 145 74 Z" fill="#ffffff" />
        </svg>
      )

    case 'rumah_izin_salam':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#fff7ed" rx="16" />
          <rect y="150" width="300" height="50" fill="#fed7aa" />
          {/* Pintu Rumah Kayu Elegan */}
          <rect x="60" y="40" width="80" height="120" rx="6" fill="#b45309" />
          <circle cx="75" cy="100" r="5" fill="#facc15" />
          {/* Bel / Ketukan Pintu Sopan 3 Kali */}
          <circle cx="155" cy="85" r="8" fill="#fbbf24" />
          <path d="M165 75 Q 175 85 165 95" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Anak Mengetuk Sambil Mengucap Salam (Strictly Faceless) */}
          <g transform="translate(160, 45)">
            <circle cx="50" cy="40" r="15" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#10b981" />
            <line x1="40" y1="80" x2="10" y2="85" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
            <circle cx="8" cy="86" r="6" fill="#fed7aa" />
          </g>
        </svg>
      )

    /* ====================================================================
       LEVEL 3: MENUJU SEKOLAH (Adab Guru, Teman, Tertib Kelas & Kebersihan)
       ==================================================================== */
    case 'sekolah_salam_guru':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#eff6ff" rx="16" />
          <rect y="145" width="300" height="55" fill="#bfdbfe" />
          {/* Tiang Bendera Merah Putih Halaman Sekolah */}
          <line x1="50" y1="30" x2="50" y2="160" stroke="#64748b" strokeWidth="4" />
          <rect x="52" y="35" width="30" height="10" fill="#ef4444" />
          <rect x="52" y="45" width="30" height="10" fill="#ffffff" />
          {/* Ibu Guru (Kiri) & Siswa SD (Kanan) Bersalaman Sopan - Strictly Faceless */}
          <g transform="translate(80, 35)">
            <circle cx="50" cy="40" r="16" fill="#fed7aa" />
            <path d="M28 32 C28 14 72 14 72 32 C72 65 64 78 50 78 C36 78 28 65 28 32 Z" fill="#047857" />
            <path d="M24 72 C24 64 76 64 76 72 L80 130 C80 134 20 134 20 130 Z" fill="#059669" />
          </g>
          <g transform="translate(170, 55)">
            <circle cx="50" cy="40" r="14" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
            <path d="M30 65 C30 58 70 58 70 65 L76 110 C76 112 24 112 24 110 Z" fill="#f8fafc" />
            {/* Celana Merah SD */}
            <rect x="30" y="105" width="40" height="25" fill="#dc2626" />
          </g>
        </svg>
      )

    case 'sekolah_sayang_teman':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdfa" rx="16" />
          <rect y="145" width="300" height="55" fill="#99f6e4" />
          {/* Bangku Taman Sekolah */}
          <rect x="70" y="115" width="160" height="14" rx="4" fill="#78350f" />
          <line x1="85" y1="125" x2="85" y2="160" stroke="#78350f" strokeWidth="5" />
          <line x1="215" y1="125" x2="215" y2="160" stroke="#78350f" strokeWidth="5" />
          {/* Dua Sahabat Membaca Buku Bersama */}
          <g transform="translate(50, 45)">
            <circle cx="50" cy="38" r="14" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 38 L36 38 Z" fill="#18181b" />
            <path d="M28 64 C28 58 72 58 72 64 L75 105 C75 108 25 108 25 105 Z" fill="#f8fafc" />
          </g>
          <g transform="translate(150, 45)">
            <circle cx="50" cy="38" r="14" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 38 L36 38 Z" fill="#18181b" />
            <path d="M28 64 C28 58 72 58 72 64 L75 105 C75 108 25 108 25 105 Z" fill="#f8fafc" />
          </g>
          {/* Buku Terbuka di Tengah */}
          <path d="M135 110 L150 115 L165 110 L165 125 L150 130 L135 125 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        </svg>
      )

    case 'sekolah_tertib_kelas':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f8fafc" rx="16" />
          {/* Papan Tulis Hijau Kelas */}
          <rect x="50" y="30" width="200" height="90" rx="6" fill="#065f46" stroke="#b45309" strokeWidth="5" />
          {/* Tulisan Pelajaran & Angka di Papan Tulis */}
          <line x1="80" y1="55" x2="130" y2="55" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="75" x2="160" y2="75" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="95" x2="120" y2="95" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          {/* Bintang Penghargaan Prestasi */}
          <circle cx="210" cy="65" r="14" fill="#f59e0b" />
          {/* Meja Belajar Rapi di Depan */}
          <rect x="80" y="140" width="140" height="35" rx="5" fill="#d97706" />
          <rect x="100" y="130" width="30" height="10" rx="2" fill="#ffffff" />
          <rect x="140" y="130" width="12" height="10" rx="2" fill="#ef4444" />
        </svg>
      )

    case 'sekolah_kebersihan':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdf4" rx="16" />
          <rect y="145" width="300" height="55" fill="#dcfce7" />
          {/* Tempat Sampah Tiga Warna Sekolah (Organik, Anorganik, Kertas) */}
          <g transform="translate(60, 100)">
            <rect width="32" height="50" rx="4" fill="#22c55e" />
            <rect x="4" y="-5" width="24" height="6" rx="2" fill="#15803d" />
          </g>
          <g transform="translate(105, 100)">
            <rect width="32" height="50" rx="4" fill="#3b82f6" />
            <rect x="4" y="-5" width="24" height="6" rx="2" fill="#1d4ed8" />
          </g>
          <g transform="translate(150, 100)">
            <rect width="32" height="50" rx="4" fill="#eab308" />
            <rect x="4" y="-5" width="24" height="6" rx="2" fill="#ca8a04" />
          </g>
          {/* Siswa Membuang Sampah dengan Tertib (Strictly Faceless) */}
          <g transform="translate(200, 35)">
            <circle cx="50" cy="40" r="14" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#f8fafc" />
            {/* Tangan Membuang Kertas */}
            <line x1="35" y1="80" x2="0" y2="95" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
            <circle cx="-2" cy="98" r="5" fill="#e2e8f0" />
          </g>
        </svg>
      )

    /* ====================================================================
       LEVEL 4: HUTAN & ALAM (Adab Kelestarian, Tumbuhan, Bebas Hewan Bernyawa)
       ==================================================================== */
    case 'alam_rawat_tanaman':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#fefce8" rx="16" />
          <rect y="145" width="300" height="55" fill="#bbf7d0" />
          {/* Pot Tanaman dan Daun Hijau Segar */}
          <path d="M190 130 L210 180 L170 180 Z" fill="#b45309" />
          <circle cx="190" cy="120" r="16" fill="#15803d" />
          <circle cx="178" cy="110" r="12" fill="#22c55e" />
          <circle cx="202" cy="110" r="12" fill="#4ade80" />
          {/* Anak Menyiram Tanaman - Strictly Faceless */}
          <g transform="translate(60, 30)">
            <circle cx="50" cy="40" r="15" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#065f46" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#ea580c" />
            {/* Teko Siram Hijau */}
            <rect x="75" y="90" width="28" height="20" rx="4" fill="#059669" />
            <path d="M103 92 L120 82" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
            <line x1="120" y1="84" x2="135" y2="105" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 3" />
          </g>
        </svg>
      )

    case 'alam_lindung_pohon':
    case 'alam_lindung_satwa':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdfa" rx="16" />
          <rect y="145" width="300" height="55" fill="#a7f3d0" />
          {/* Pohon Rindang Bertingkat Asri */}
          <rect x="195" y="80" width="22" height="90" fill="#78350f" />
          <circle cx="206" cy="70" r="45" fill="#15803d" />
          <circle cx="180" cy="60" r="28" fill="#22c55e" />
          <circle cx="230" cy="65" r="26" fill="#16a34a" />
          {/* Bunga-bunga Cantik di Bawah Pohon */}
          <circle cx="160" cy="165" r="7" fill="#f43f5e" />
          <circle cx="245" cy="165" r="6" fill="#eab308" />
          {/* Anak Menjaga Kelestarian Alam - Strictly Faceless */}
          <g transform="translate(60, 35)">
            <circle cx="50" cy="40" r="15" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#8b5cf6" />
          </g>
        </svg>
      )

    case 'alam_jaga_sungai':
    case 'alam_sayang_hewan':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0fdf4" rx="16" />
          <rect y="140" width="300" height="60" fill="#86efac" />
          {/* Aliran Sungai Bersih Beriak Biru */}
          <path d="M140 140 Q 200 170 300 160 L 300 200 L 120 200 Z" fill="#38bdf8" />
          <path d="M160 160 Q 210 180 280 175" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
          {/* Tempat Sampah Bersih di Tepi Sungai */}
          <rect x="70" y="125" width="28" height="40" rx="4" fill="#0284c7" />
          <rect x="66" y="120" width="36" height="8" rx="2" fill="#0369a1" />
          {/* Anak Tertib Membuang Sampah - Strictly Faceless */}
          <g transform="translate(15, 25)">
            <circle cx="50" cy="40" r="15" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#059669" />
            <line x1="68" y1="85" x2="88" y2="105" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
            <circle cx="90" cy="107" r="6" fill="#fed7aa" />
          </g>
        </svg>
      )

    case 'alam_bersih_jalan':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f8fafc" rx="16" />
          <rect y="140" width="300" height="60" fill="#e2e8f0" />
          {/* Ranting / Duri yang Disingkirkan dari Jalan */}
          <path d="M185 160 L215 155 L200 168" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          {/* Anak Mengambil Ranting dari Jalan - Strictly Faceless */}
          <g transform="translate(60, 30)">
            <circle cx="50" cy="40" r="15" fill="#fed7aa" />
            <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#0284c7" />
            <path d="M30 65 C30 58 70 58 70 65 L76 115 C76 118 24 118 24 115 Z" fill="#10b981" />
            <line x1="68" y1="85" x2="110" y2="125" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
            <circle cx="112" cy="127" r="7" fill="#fed7aa" />
          </g>
        </svg>
      )

    /* ====================================================================
       LEVEL 5: ARENA SUMBER LASER (Pistol Air, Menara Laser, Doa & Perisai)
       ==================================================================== */
    case 'arena_doa_syukur':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0f9ff" rx="16" />
          {/* Cahaya Berkah Keemasan */}
          <circle cx="150" cy="90" r="60" fill="#fef08a" opacity="0.4" />
          {/* Dua Tangan Berdoa Menengadah - Faceless Minimalis */}
          <path d="M130 130 C120 100 135 70 145 75 C150 78 145 110 142 135 Z" fill="#fed7aa" />
          <path d="M170 130 C180 100 165 70 155 75 C150 78 155 110 158 135 Z" fill="#fed7aa" />
          {/* Bintang Syukur dan Doa Berpendar */}
          <circle cx="150" cy="50" r="12" fill="#38bdf8" />
          <path d="M150 35 L150 65 M135 50 L165 50" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )

    case 'arena_jujur':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#fefce8" rx="16" />
          {/* Perisai Emas Kejujuran */}
          <path d="M150 35 L200 60 L200 115 C200 155 150 175 150 175 C150 175 100 155 100 115 L100 60 Z" fill="#f59e0b" />
          <path d="M150 48 L188 68 L188 112 C188 144 150 160 150 160 C150 160 112 144 112 112 L112 68 Z" fill="#fbbf24" />
          {/* Permata Putih Bersih di Tengah Perisai */}
          <polygon points="150,75 168,95 150,135 132,95" fill="#ffffff" />
        </svg>
      )

    case 'arena_padam_amarah':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#eff6ff" rx="16" />
          {/* Bejana Air Wudhu Sejuk */}
          <ellipse cx="150" cy="140" rx="60" ry="20" fill="#0284c7" />
          <path d="M90 140 C90 170 210 170 210 140 Z" fill="#0369a1" />
          {/* Tetesan Air Jernih Memadamkan Api */}
          <path d="M150 60 C130 95 130 115 150 120 C170 115 170 95 150 60 Z" fill="#38bdf8" />
          <circle cx="150" cy="100" r="8" fill="#ffffff" opacity="0.6" />
          {/* Riak Air Sejuk Damai */}
          <ellipse cx="150" cy="140" rx="35" ry="10" stroke="#bae6fd" strokeWidth="2.5" fill="none" />
        </svg>
      )

    case 'arena_water_blaster':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#ecfeff" rx="16" />
          {/* Pistol Air Modern Biru Toska */}
          <g transform="translate(60, 65)">
            <rect x="20" y="25" width="80" height="26" rx="8" fill="#06b6d4" />
            <rect x="100" y="32" width="25" height="12" rx="4" fill="#0891b2" />
            <rect x="0" y="15" width="45" height="40" rx="10" fill="#38bdf8" />
            <rect x="20" y="50" width="18" height="35" rx="5" fill="#1e293b" />
            {/* Semprotan Air Berpendar */}
            <circle cx="140" cy="38" r="8" fill="#38bdf8" />
            <circle cx="165" cy="36" r="11" fill="#06b6d4" />
            <circle cx="195" cy="33" r="14" fill="#0284c7" />
          </g>
        </svg>
      )

    case 'arena_laser_tower':
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#0f172a" rx="16" />
          {/* Menara Kristal Laser Pink Neon */}
          <polygon points="150,30 175,90 125,90" fill="#ff0077" />
          <polygon points="150,90 185,160 115,160" fill="#be185d" />
          <circle cx="150" cy="65" r="10" fill="#ffffff" />
          {/* Cincin Laser Berpendar */}
          <ellipse cx="150" cy="95" rx="55" ry="16" stroke="#ff0077" strokeWidth="4" fill="none" />
        </svg>
      )

    /* ====================================================================
       MINI-GAME PUZZLE 3x3 ADAB (Level 5)
       ==================================================================== */
    case 'puzzle_adab_ortu':
      return (
        <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#f0fdf4" rx="20" />
          <rect y="210" width="300" height="90" fill="#bbf7d0" />
          <rect x="180" y="180" width="100" height="40" rx="6" fill="#fde68a" />
          <rect x="200" y="150" width="50" height="40" rx="8" fill="#d97706" />
          <circle cx="215" cy="145" r="10" fill="#ef4444" />
          <circle cx="235" cy="148" r="9" fill="#eab308" />
          {/* Ibu (Kiri) - Strictly Faceless */}
          <g transform="translate(40, 50)">
            <circle cx="50" cy="40" r="18" fill="#fed7aa" />
            <path d="M28 32 C28 14 72 14 72 32 C72 65 64 78 50 78 C36 78 28 65 28 32 Z" fill="#10b981" />
            <path d="M24 72 C24 64 76 64 76 72 L82 140 C82 145 18 145 18 140 Z" fill="#047857" />
          </g>
          {/* Anak Membantu Membawa Buah (Kanan) - Strictly Faceless */}
          <g transform="translate(130, 80)">
            <circle cx="50" cy="45" r="15" fill="#fed7aa" />
            <path d="M36 38 C36 26 64 26 64 38 L64 43 L36 43 Z" fill="#18181b" />
            <path d="M30 70 C30 64 70 64 70 70 L74 125 C74 128 26 128 26 125 Z" fill="#38bdf8" />
            <circle cx="16" cy="85" r="9" fill="#ef4444" />
          </g>
        </svg>
      )

    case 'puzzle_berbagi':
      return (
        <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#fefce8" rx="20" />
          <rect y="215" width="300" height="85" fill="#fef08a" />
          <rect x="70" y="180" width="160" height="45" rx="8" fill="#d97706" />
          <rect x="120" y="165" width="60" height="25" rx="5" fill="#22c55e" />
          <circle cx="140" cy="172" r="6" fill="#f97316" />
          <circle cx="160" cy="172" r="5" fill="#3b82f6" />
          {/* Anak 1 (Kiri) - Berbagi Roti */}
          <g transform="translate(30, 75)">
            <circle cx="50" cy="42" r="16" fill="#fed7aa" />
            <path d="M35 36 C35 25 65 25 65 36 L65 42 L35 42 Z" fill="#18181b" />
            <path d="M28 68 C28 60 72 60 72 68 L76 130 C76 134 24 134 24 130 Z" fill="#6366f1" />
          </g>
          {/* Anak 2 (Kanan) - Menerima dengan Senang */}
          <g transform="translate(170, 75)">
            <circle cx="50" cy="42" r="16" fill="#fed7aa" />
            <path d="M35 36 C35 25 65 25 65 36 L65 42 L35 42 Z" fill="#0f766e" />
            <path d="M28 68 C28 60 72 60 72 68 L76 130 C76 134 24 134 24 130 Z" fill="#ec4899" />
          </g>
        </svg>
      )

    case 'puzzle_shalat':
      return (
        <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#ecfdf5" rx="20" />
          <rect y="180" width="300" height="120" fill="#10b981" />
          <line x1="0" y1="230" x2="300" y2="230" stroke="#fef08a" strokeWidth="6" strokeDasharray="16 10" />
          {/* Shaf 3 Jamaah Berdiri Rapat Sejajar (Strictly Faceless) */}
          {[50, 150, 250].map((cx, idx) => (
            <g key={idx} transform={`translate(${cx - 50}, 80)`}>
              <circle cx="50" cy="40" r="16" fill="#fed7aa" />
              <path d="M36 34 C36 22 64 22 64 34 L64 39 L36 39 Z" fill="#18181b" />
              <path d="M30 65 C30 58 70 58 70 65 L72 110 C72 112 28 112 28 110 Z" fill="#ffffff" />
              <path d="M28 110 L72 110 L74 148 L26 148 Z" fill={idx === 1 ? '#047857' : '#1e3a8a'} />
            </g>
          ))}
        </svg>
      )

    default:
      // Simbol Adab Islami (Kubah Masjid & Dua Daun Hijau Segar)
      return (
        <svg viewBox="0 0 300 200" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f0f9ff" rx="16" />
          <path d="M110 140 C110 80 190 80 190 140 Z" fill="#38bdf8" />
          <circle cx="150" cy="65" r="12" fill="#fde047" />
          <rect x="70" y="140" width="160" height="30" rx="6" fill="#0284c7" />
          {/* Dua Daun Segar */}
          <path d="M150 130 C135 110 145 95 155 105 C165 95 175 110 150 130 Z" fill="#22c55e" />
        </svg>
      )
  }
}
