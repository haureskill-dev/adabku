import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

const TONES = {
  good: 'bg-grass text-white',
  bad: 'bg-laser text-white',
  info: 'bg-sky text-white',
}

/** Notifikasi singkat (terkena laser, perisai aktif, dll). */
export default function Toast() {
  const toast = useGameStore((s) => s.toast)
  const clearToast = useGameStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => clearToast(toast.id), 2400)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null
  return (
    <div className="pointer-events-none absolute top-24 left-1/2 z-30 -translate-x-1/2 sm:top-6">
      <div
        key={toast.id}
        role="status"
        className={`animate-toast rounded-full border-4 border-white px-5 py-2 font-display text-lg font-extrabold whitespace-nowrap shadow-xl ${TONES[toast.tone]}`}
      >
        {toast.text}
      </div>
    </div>
  )
}
