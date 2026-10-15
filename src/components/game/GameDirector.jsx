import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CHECKPOINTS, FINISH_Z, START_Z, TRACK_LENGTH } from '../../config/track'
import { player } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'

/**
 * "Sutradara" permainan (tanpa visual):
 * - menghitung waktu tempuh & progres,
 * - membuka Kuis Adab saat pemain melewati gerbang checkpoint,
 * - menyelesaikan permainan saat melewati garis finish.
 */
export default function GameDirector() {
  const elapsed = useRef(0)
  const lastPush = useRef(-1)

  useEffect(() => {
    elapsed.current = 0
    lastPush.current = -1
  }, [])

  useFrame((_, rawDelta) => {
    const store = useGameStore.getState()
    if (store.phase !== 'playing') return

    elapsed.current += Math.min(rawDelta, 0.05)

    // Perbarui HUD 10x per detik saja (hemat render)
    const tick = Math.floor(elapsed.current * 10)
    const pz = player?.z ?? 0
    if (tick !== lastPush.current) {
      lastPush.current = tick
      const progress = Math.min(1, Math.max(0, (START_Z - pz) / TRACK_LENGTH))
      store.setClock(elapsed.current, progress)
    }

    const next = CHECKPOINTS[store.checkpointIndex]
    if (next !== undefined && pz <= next) {
      store.openQuiz()
      return
    }

    if (store.checkpointIndex >= CHECKPOINTS.length && pz <= FINISH_Z) {
      store.setClock(elapsed.current, 1)
      store.finish('selesai')
    }
  })

  return null
}
