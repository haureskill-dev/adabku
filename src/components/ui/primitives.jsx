/** Komponen dasar UI yang dipakai bersama oleh semua overlay (Bersih, Tajam, Bebas Blur). */

const VARIANTS = {
  green: 'bg-emerald-500 text-white shadow-[0_6px_0_#047857] hover:bg-emerald-600 active:bg-emerald-700',
  orange: 'bg-amber-500 text-white shadow-[0_6px_0_#b45309] hover:bg-amber-600 active:bg-amber-700',
  sky: 'bg-sky-500 text-white shadow-[0_6px_0_#0369a1] hover:bg-sky-600 active:bg-sky-700',
  sun: 'bg-yellow-400 text-slate-900 shadow-[0_6px_0_#ca8a04] hover:bg-yellow-500 active:bg-yellow-600',
  white: 'bg-white text-slate-800 shadow-[0_6px_0_#cbd5e1] hover:bg-slate-50',
}

/** Tombol besar ramah anak dengan efek "ditekan" ceria. */
export function BigButton({ variant = 'green', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-2xl px-6 py-4 font-display text-xl font-extrabold tracking-wide transition-all duration-100 active:translate-y-1.5 active:shadow-none disabled:cursor-default disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Latar Modal / Layar Bersih & Tajam (No Blur):
 * - Hapus seluruh efek backdrop-blur buram sesuai spesifikasi
 * - Tampilan kristal jernih, cerah, tajam benderang untuk anak SD
 */
export function Overlay({ children, className = '', labelledBy, transparentBackdrop = false }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className={`absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none ${
        transparentBackdrop
          ? 'bg-emerald-950/20'
          : 'bg-slate-900/35'
      }`}
    >
      <div
        className={`max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-3xl border-3 border-emerald-300 bg-white p-5 shadow-2xl sm:p-7 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

export { formatTime } from '../../utils/format'
