import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

/**
 * Shortcut global:
 * - Esc / P  : jeda / lanjut
 * Juga melepas fokus tombol saat permainan berjalan, agar Spasi (lompat)
 * tidak ikut "mengklik" tombol UI yang terakhir difokus.
 */
export function useGameHotkeys() {
  const phase = useGameStore((s) => s.phase)

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return
      if (e.code === 'Escape') {
        if (typeof document !== 'undefined' && document.pointerLockElement) {
          document.exitPointerLock?.()
          return
        }
        useGameStore.getState().togglePause()
      } else if (e.code === 'KeyP') {
        useGameStore.getState().togglePause()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (phase === 'playing') document.activeElement?.blur?.()
    // Lepaskan semua tombol sentuh saat fase berubah
    useGameStore.setState({
      touch: { forward: false, backward: false, left: false, right: false, jump: false, crouch: false },
    })
  }, [phase])
}
