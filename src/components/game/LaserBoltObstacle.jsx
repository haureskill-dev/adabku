import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { FINISH_Z, TRACK_LENGTH } from '../../config/track'
import { PLAYER } from '../../config/controls'
import { getBadDeedsForLevel } from '../../data/adab'
import { player } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'
import { sound } from '../../utils/audio'

const BOLT_CONFIG = {
  lowY: 0.35, // Tembakan rendah dekat lantai -> LOMPAT
  highY: 1.35, // Tembakan tinggi setinggi dada/kepala -> MENUNDUK
  boltLength: 2.4, // Panjang proyektil laser tunggal
  boltRadius: 0.11, // Ketebalan proyektil yang tegas & jelas terlihat
  baseSpeed: 9.5, // Kecepatan meluncur lebih lambat & halus (waktu reaksi ~3.5 detik)
  spawnAhead: 34, // Jarak spawn di depan pemain (meter)
  firstDelay: 2.2, // Jeda awal sebelum tembakan pertama
  intervalMin: 3.2, // Interval antar tembakan proyektil
  intervalMax: 4.5,
  color: '#ff0077', // Pink Neon Bright berpendar terang dan bersih
}

const rand = (a, b) => a + Math.random() * (b - a)

/**
 * 3D Floating Pill Label Adab Buruk di atas proyektil laser.
 * Dibuat menggunakan Three.js Billboard + CanvasTexture native (100% aman DOM React 19).
 */
function LaserBadge3D({ label, low }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()
    ctx.clearRect(0, 0, 512, 200)

    // Pill background putih bersih semi-transparan dengan border tajam
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.beginPath()
    ctx.roundRect(14, 14, 484, 172, 34)
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = low ? '#10b981' : '#f59e0b'
    ctx.stroke()

    // Teks Nama Perilaku Adab Buruk
    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`🚫 ${label}`, 256, 68)

    // Badge Aksi Lompat / Menunduk
    ctx.fillStyle = low ? '#10b981' : '#f59e0b'
    ctx.beginPath()
    ctx.roundRect(76, 116, 360, 54, 27)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 26px sans-serif'
    ctx.fillText(low ? '[ LOMPAT! ] (Space)' : '[ MENUNDUK! ] (Shift/C)', 256, 143)

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [label, low])

  return (
    <mesh>
      <planeGeometry args={[2.7, 1.05]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

/**
 * Satu Proyektil Laser Tunggal Super Bright Neon (Single Laser Bolt).
 * - Menggunakan MeshBasicMaterial color="#ff0044" & toneMapped: false
 * - Dilengkapi PointLight internal untuk pendaran cahaya merah terang
 */
function SingleLaserBolt({
  id,
  startX,
  targetX,
  spawnZ,
  targetZ,
  low,
  label,
  speedZ,
  speedX,
  angleY,
  onDone,
}) {
  const group = useRef()
  const pos = useRef({ x: startX, z: spawnZ })
  const resolved = useRef(false)
  const y = low ? BOLT_CONFIG.lowY : BOLT_CONFIG.highY

  useFrame((state, rawDelta) => {
    if (useGameStore.getState().phase !== 'playing') return
    const dt = Math.min(rawDelta, 0.05)
    const g = group.current
    if (!g) return

    const prevZ = pos.current.z

    // Pergerakan meluncur halus secara diagonal:
    pos.current.z += speedZ * dt
    pos.current.x += speedX * dt

    // Update posisi dan orientasi proyektil
    const t = state.clock.elapsedTime
    const bobY = y + Math.sin(t * 10 + id) * 0.02
    g.position.set(pos.current.x, bobY, pos.current.z)
    g.rotation.y = angleY

    // Deteksi tabrakan saat proyektil melintasi koordinat Z pemain
    const pz = player?.z ?? 0
    const px = player?.x ?? 0
    const py = player?.y ?? 0
    const crouchT = player?.crouchT ?? 0
    const pTime = player?.time ?? 0
    const invulnUntil = player?.invulnUntil ?? 0

    if (!resolved.current && prevZ < pz && pos.current.z >= pz) {
      resolved.current = true
      const store = useGameStore.getState()

      if (pTime < invulnUntil) return

      // Periksa apakah pemain berada di jalur lintas proyektil (jarak horizontal)
      const lateralDist = Math.abs(pos.current.x - px)
      const isDirectPath = lateralDist < 0.85 // Radius kontak horizontal

      if (isDirectPath) {
        let hit = false
        if (low) {
          // Laser Rendah: harus melompat (player.y > 0.45m)
          if (py < 0.45) {
            hit = true
          }
        } else {
          // Laser Tinggi: harus menunduk (crouchT > 0.45)
          if (crouchT < 0.45) {
            hit = true
          }
        }

        if (hit) {
          if (player) player.invulnUntil = pTime + PLAYER.invulnSeconds
          store.hitLaser(label)
        } else {
          store.dodgeLaser()
        }
      } else {
        // Proyektil melintas di samping jalur pemain tanpa menabrak
        store.dodgeLaser()
      }
    }

    // Hapus proyektil setelah meluncur 8 meter di belakang pemain
    if (pos.current.z > pz + 8) {
      onDone(id)
    }
  })

  return (
    <group ref={group} position={[startX, y, spawnZ]}>
      {/* 1. Tabung Laser Pink Neon Bright Murni (#ff0077) */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry
          args={[
            BOLT_CONFIG.boltRadius,
            BOLT_CONFIG.boltRadius,
            BOLT_CONFIG.boltLength,
            20,
          ]}
        />
        <meshBasicMaterial color="#ff0077" toneMapped={false} />
      </mesh>

      {/* 2. Inti Dalam Putih Terang Tajam (Sci-Fi Ultra-Bright White Core) */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry
          args={[
            BOLT_CONFIG.boltRadius * 0.48,
            BOLT_CONFIG.boltRadius * 0.48,
            BOLT_CONFIG.boltLength + 0.04,
            16,
          ]}
        />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 3. Floating Pill Label Adab Buruk Melayang di Atas Proyektil */}
      <Billboard position={[0, 0.85, 0]}>
        <LaserBadge3D label={label} low={low} />
      </Billboard>
    </group>
  )
}

/**
 * Komponen Manajer Tembakan Proyektil Laser Tunggal & Diagonal (LaserBoltObstacle).
 * Meluncurkan hanya 1 proyektil laser berpendar per siklus dengan arah diagonal dinamis
 * dan kecepatan yang terukur agar pemain anak SD memiliki waktu reaksi yang cukup.
 */
export default function LaserBoltObstacle({ laserReset = 0 }) {
  const [bolts, setBolts] = useState([])
  const timer = useRef(BOLT_CONFIG.firstDelay)
  const nextId = useRef(1)

  // Bersihkan proyektil setiap kali checkpoint kuis dibuka atau permainan di-reset
  useEffect(() => {
    setBolts([])
    timer.current = BOLT_CONFIG.firstDelay
  }, [laserReset])

  const removeBolt = useCallback((id) => {
    setBolts((list) => list.filter((b) => b.id !== id))
  }, [])

  useFrame((_, rawDelta) => {
    if (useGameStore.getState().phase !== 'playing') return
    timer.current -= Math.min(rawDelta, 0.05)
    if (timer.current > 0) return

    const progress = THREE.MathUtils.clamp(-player.z / TRACK_LENGTH, 0, 1)
    // Interval antar tembakan proyektil (satu per satu secara berkala)
    timer.current = rand(BOLT_CONFIG.intervalMin, BOLT_CONFIG.intervalMax) * (1 - progress * 0.15)

    const spawnZ = player.z - BOLT_CONFIG.spawnAhead
    if (spawnZ < FINISH_Z - 5) return

    // 1. Tentukan Titik Awal (Sisi Kiri atau Sisi Kanan Koridor)
    const fromLeft = Math.random() < 0.5
    const startX = fromLeft ? rand(-3.4, -2.4) : rand(2.4, 3.4)

    // 2. Tentukan Titik Tujuan Melintasi Jalur Pemain ke Arah Seberang
    const targetX = fromLeft ? rand(0.5, 2.6) : rand(-2.6, -0.5)

    const targetZ = player.z
    const distZ = targetZ - spawnZ // bernilai positif (~34m)
    const distX = targetX - startX

    // 3. Kecepatan Maju (+Z) & Kecepatan Menyamping (X)
    const speedZ = BOLT_CONFIG.baseSpeed * (1 + progress * 0.12)
    const speedX = (distX / distZ) * speedZ

    // 4. Sudut Rotasi Proyektil agar Sejajar dengan Lintasan Diagonalnya
    const angleY = Math.atan2(speedX, speedZ)

    // Bunyikan SFX laser sci-fi lembut saat tembakan meluncur
    sound.playLaser()

    const currentLevel = useGameStore.getState().currentLevel
    const deeds = getBadDeedsForLevel(currentLevel)
    const label = deeds[Math.floor(Math.random() * deeds.length)]

    // Tambahkan HANYA 1 proyektil tunggal ke siklus permainan
    setBolts((list) => [
      ...list,
      {
        id: nextId.current++,
        startX,
        targetX,
        spawnZ,
        targetZ,
        low: Math.random() < 0.5,
        label,
        speedZ,
        speedX,
        angleY,
      },
    ])
  })

  return bolts.map((bolt) => (
    <SingleLaserBolt key={bolt.id} {...bolt} onDone={removeBolt} />
  ))
}
