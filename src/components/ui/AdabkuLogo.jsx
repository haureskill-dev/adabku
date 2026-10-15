import { useState } from 'react'
import TwoLeavesIcon from './TwoLeavesIcon'

const SIZES = {
  xs: 'size-7 sm:size-8',
  sm: 'size-9 sm:size-10',
  md: 'size-11 sm:size-12',
  lg: 'size-16 sm:size-20',
  xl: 'size-24 sm:size-28',
}

/**
 * Komponen Logo Bulat Konsisten Game Adabku:
 * - Menampilkan logo bulat (rounded-full) berbingkai ceria
 * - Memakai aset gambar public/logo.png (Ikon Tumbuhan 2 Daun 3D segar)
 * - Otomatis fallback ke TwoLeavesIcon jika gambar gagal dimuat
 */
export default function AdabkuLogo({
  size = 'md',
  className = '',
  imgClassName = '',
  showBorder = true,
}) {
  const [imgError, setImgError] = useState(false)
  const sizeClasses = SIZES[size] || size

  return (
    <div
      className={`relative select-none flex-shrink-0 rounded-full flex items-center justify-center bg-white ${
        showBorder ? 'border-2 sm:border-3 border-emerald-400 shadow-md ring-2 ring-emerald-100' : ''
      } ${sizeClasses} ${className}`}
      aria-label="Logo Adabku"
    >
      {!imgError ? (
        <img
          src="/logo.png"
          alt="Logo Adabku Bulat"
          onError={() => setImgError(true)}
          className={`h-full w-full rounded-full object-cover p-1 transition-transform hover:scale-105 ${imgClassName}`}
        />
      ) : (
        <div className="grid place-items-center p-1 text-emerald-600">
          <TwoLeavesIcon className="h-full w-full" />
        </div>
      )}
    </div>
  )
}
