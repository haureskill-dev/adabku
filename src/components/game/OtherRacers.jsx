import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { START_Z } from '../../config/track'
import { player } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'
import CapsuleCharacter from './CapsuleCharacter'

/* ------------------------------------------------------------------
 * Avatar 3D Pemain Lain (Massive Multiplayer Bot Runners)
 * Karakter strictly Faceless Capsule Minimalis
 * dengan skema warna pastel modern (roughness 0.2, metalness 0.1).
 * ------------------------------------------------------------------ */

const BOT_CONFIGS = [
  { name: 'bot-1 (Rayyan)', color: '#fb923c', lane: -2.4, zOffset: 1.2, speed: 4.85 },
  { name: 'bot-2 (Aisyah)', color: '#38bdf8', lane: 2.3, zOffset: -1.0, speed: 5.15 },
  { name: 'bot-3 (Fathir)', color: '#86efac', lane: -1.1, zOffset: -3.5, speed: 5.05 },
  { name: 'bot-4 (Zahra)', color: '#f472b6', lane: 1.2, zOffset: 2.0, speed: 4.75 },
  { name: 'bot-5 (Hasan)', color: '#a78bfa', lane: 0.0, zOffset: -2.2, speed: 5.2 },
  { name: 'bot-6 (Maryam)', color: '#fde047', lane: -2.8, zOffset: -5.0, speed: 5.1 },
  { name: 'bot-7 (Bilal)', color: '#34d399', lane: 2.8, zOffset: 0.5, speed: 4.95 },
  { name: 'bot-8 (Khadijah)', color: '#fb7185', lane: -0.6, zOffset: 3.0, speed: 4.7 },
  { name: 'bot-9 (Umar)', color: '#60a5fa', lane: 1.8, zOffset: -4.0, speed: 5.25 },
  { name: 'bot-10 (Fatima)', color: '#facc15', lane: -1.8, zOffset: -0.5, speed: 5.0 },
  { name: 'bot-11 (Ibrahim)', color: '#2dd4bf', lane: 0.8, zOffset: -6.0, speed: 5.3 },
]

function BotNametag({ name, color }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()
    ctx.clearRect(0, 0, 256, 64)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
    ctx.beginPath()
    ctx.roundRect(8, 8, 240, 48, 24)
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = color
    ctx.stroke()

    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, 128, 32)

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [name, color])

  return (
    <Billboard position={[0, 1.95, 0]}>
      <mesh>
        <planeGeometry args={[1.5, 0.38]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
    </Billboard>
  )
}

function BotAvatar({ config, index, onPositionUpdate }) {
  const root = useRef()
  const sim = useRef({
    x: config.lane,
    y: 0,
    z: START_Z + config.zOffset,
    speed: config.speed,
    phase: index * 0.8,
    isJumping: false,
  })

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05)
    const s = sim.current
    const active = useGameStore.getState().phase === 'playing'

    if (active) {
      // Maju menyusuri koridor
      s.z -= s.speed * dt
      s.phase += dt * s.speed * 2.8

      // Lompatan bot berkala secara dinamis saat melintasi rintangan
      const jumpWave = Math.sin(s.z * 0.14 + index * 1.2)
      if (jumpWave > 0.93) {
        s.y = Math.max(0, Math.sin(s.phase * 3) * 0.85)
        s.isJumping = s.y > 0.1
      } else {
        s.y = 0
        s.isJumping = false
      }

      if (root.current) {
        root.current.position.set(s.x, s.y, s.z)
      }
    }

    onPositionUpdate(index, s.z)
  })

  return (
    <group ref={root} position={[config.lane, 0, START_Z + config.zOffset]}>
      {/* Nametag Bot di atas kepala */}
      <BotNametag name={config.name} color={config.color} />

      {/* Model Karakter Kapsul Imut Bot */}
      <CapsuleCharacter
        color={config.color}
        accentColor="#ffffff"
        crouchT={0}
        isJumping={sim.current.isJumping}
        isWalking={true}
        steerTilt={0}
        forwardTilt={0.1}
        runPhase={sim.current.phase}
        shields={0}
      />
    </group>
  )
}

export default function OtherRacers() {
  const botPositions = useRef(new Array(BOT_CONFIGS.length).fill(0))
  const lastRankUpdate = useRef(0)

  const handlePositionUpdate = (index, z) => {
    botPositions.current[index] = z
  }

  useFrame((state) => {
    // Perbarui peringkat pemain 5 kali per detik
    const t = state.clock.elapsedTime
    if (t - lastRankUpdate.current > 0.2) {
      lastRankUpdate.current = t
      // Di lintasan lurus (-Z), Z lebih kecil berarti berada lebih di depan
      const playerZ = player?.z ?? 0
      const aheadCount = botPositions.current.filter((z) => z < playerZ).length
      const currentRank = 1 + aheadCount
      useGameStore.getState().setRank(currentRank)
    }
  })

  return (
    <group>
      {BOT_CONFIGS.map((config, i) => (
        <BotAvatar
          key={config.name}
          config={config}
          index={i}
          onPositionUpdate={handlePositionUpdate}
        />
      ))}
    </group>
  )
}
