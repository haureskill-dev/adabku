/**
 * Ikon Logo Adabku: Dua Helai Daun Hijau Muda (Two Leaves Icon)
 * Minimalis, fresh, elegan, dan syariat-compliant (tanpa unsur makhluk bernyawa).
 */
export default function TwoLeavesIcon({ className = 'size-8' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Daun Utama (Kiri/Tengah) */}
      <path
        d="M24 42C24 42 10 36 8 20C6 6 22 6 22 6C22 6 26 18 24 42Z"
        fill="url(#leafGradient1)"
      />
      {/* Tulang Daun Utama */}
      <path
        d="M17 14C19 24 24 42 24 42"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Daun Kedua (Kanan - Lebih Kecil / Tunas Baru) */}
      <path
        d="M22 36C22 36 32 32 38 22C42 14 34 10 34 10C34 10 28 18 22 36Z"
        fill="url(#leafGradient2)"
      />
      {/* Tulang Daun Kedua */}
      <path
        d="M34 14C31 22 22 36 22 36"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* Tangkai Bawah */}
      <path
        d="M24 42C23 45 22 47 20 47"
        stroke="#15803d"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient
          id="leafGradient1"
          x1="8"
          y1="6"
          x2="24"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient
          id="leafGradient2"
          x1="22"
          y1="10"
          x2="40"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#86efac" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </svg>
  )
}
