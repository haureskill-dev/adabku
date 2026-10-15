import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { player } from '../../game/playerState'
import { LEVEL_5_ORBS, LEVEL_BAD_DEEDS } from '../../data/adab'
import { useGameStore } from '../../store/gameStore'
import { sound } from '../../utils/audio'

/**
 * Menara Pemancar Laser di Tengah Lapangan Arena Terbuka:
 * - Memancarkan proyektil laser pendek warna Pink Neon Bright (#ff0077) secara berkala.
 * - Memiliki bilah daya / HP di atas menara.
 * - Berputar secara halus & organik.
 */
function LaserEmitterTower({ towerHp = 8, towerMaxHp = 8 }) {
  const towerRef = useRef()
  const ringRef = useRef()
  const coreRef = useRef()

  useFrame((state, delta) => {
    if (towerRef.current) {
      towerRef.current.rotation.y += delta * 0.4
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.8
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.12
      coreRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  const hpRatio = towerMaxHp > 0 ? Math.max(0, Math.min(1, towerHp / towerMaxHp)) : 0

  return (
    <group position={[0, 0, 0]}>
      {/* Pondasi Menara Silinder Bertingkat */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.6, 0.8, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.8, 0.8, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Badan Utama Menara */}
      <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.8, 4.0, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.3} />
      </mesh>

      {/* Cincin Energi Berputar */}
      <mesh ref={ringRef} position={[0, 3.8, 0]}>
        <torusGeometry args={[2.0, 0.1, 16, 48]} />
        <meshBasicMaterial color="#ff0077" toneMapped={false} />
      </mesh>

      {/* Inti Pemancar Laser (Pulsing Pink Core) */}
      <mesh ref={coreRef} position={[0, 4.6, 0]}>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshBasicMaterial
          color="#ff0077"
          toneMapped={false}
          opacity={0.3 + hpRatio * 0.7}
          transparent
        />
      </mesh>
      {/* Titik Inti Putih Terang */}
      <mesh position={[0, 4.6, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Kepala Pemancar yang Berputar */}
      <group ref={towerRef} position={[0, 5.8, 0]}>
        <mesh castShadow>
          <coneGeometry args={[1.6, 1.8, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.4} />
        </mesh>

        {/* 4 Corong Pemancar Laser Pink */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <group key={i} rotation-y={angle}>
            <mesh position={[1.2, 0.2, 0]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.12, 0.18, 0.8, 16]} />
              <meshBasicMaterial color="#ff0077" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Billboard 3D: HP Bar & Label di Atas Tower */}
      <Billboard position={[0, 7.8, 0]}>
        <TowerBanner3D hpRatio={hpRatio} towerHp={towerHp} towerMaxHp={towerMaxHp} />
      </Billboard>
    </group>
  )
}

function TowerBanner3D({ hpRatio = 1, towerHp = 8, towerMaxHp = 8 }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 140
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()

    ctx.clearRect(0, 0, 512, 140)

    // Latar belakang kapsul
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
    ctx.beginPath()
    ctx.roundRect(16, 10, 480, 120, 60)
    ctx.fill()
    ctx.lineWidth = 5
    ctx.strokeStyle = '#ff0077'
    ctx.stroke()

    // Teks Judul
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 34px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`⚡ SUMBER LASER: ${towerHp}/${towerMaxHp} HP`, 256, 26)

    // Bilah HP Bar
    const barW = 400
    const barH = 22
    const barX = (512 - barW) / 2
    const barY = 80

    ctx.fillStyle = '#334155'
    ctx.beginPath()
    ctx.roundRect(barX, barY, barW, barH, 11)
    ctx.fill()

    if (hpRatio > 0) {
      ctx.fillStyle = hpRatio > 0.4 ? '#ff0077' : '#ef4444'
      ctx.beginPath()
      ctx.roundRect(barX, barY, barW * hpRatio, barH, 11)
      ctx.fill()
    }

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [hpRatio, towerHp, towerMaxHp])

  return (
    <mesh>
      <planeGeometry args={[3.8, 1.05]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

/** 3D Floating Badge Label Perilaku Buruk di Atas Laser Tower Arena */
function ArenaBoltBadge3D({ label, low }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()
    ctx.clearRect(0, 0, 512, 200)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.beginPath()
    ctx.roundRect(14, 14, 484, 172, 34)
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = low ? '#10b981' : '#f59e0b'
    ctx.stroke()

    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`🚫 ${label}`, 256, 68)

    ctx.fillStyle = low ? '#10b981' : '#f59e0b'
    ctx.beginPath()
    ctx.roundRect(76, 116, 360, 54, 27)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText(low ? '▲ LOMPAT!' : '▼ MENUNDUK!', 256, 143)

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [label, low])

  return (
    <mesh>
      <planeGeometry args={[1.9, 0.75]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

/**
 * Laser Bolt Proyektil Berpendar Pink Neon yang Ditembakkan Tower di Arena:
 * Berputar dan meluncur perlahan ke arah luar lapangan dengan label adab buruk tematik Level 5.
 */
function ArenaTowerLasers() {
  const hitLaser = useGameStore((s) => s.hitLaser)
  const dodgeLaser = useGameStore((s) => s.dodgeLaser)
  const l5Deeds = LEVEL_BAD_DEEDS[5]

  const boltsRef = useRef([
    { dist: 4.5, angle: 0, height: 0.35, speed: 7.2, dodged: false, label: l5Deeds[0] },
    { dist: 12.0, angle: Math.PI / 2, height: 1.5, speed: 7.5, dodged: false, label: l5Deeds[1] },
    { dist: 8.0, angle: Math.PI, height: 0.35, speed: 7.0, dodged: false, label: l5Deeds[2] },
    { dist: 16.0, angle: (3 * Math.PI) / 2, height: 1.5, speed: 7.3, dodged: false, label: l5Deeds[3] },
  ])

  const meshesRef = useRef([])

  useFrame((_, delta) => {
    const store = useGameStore.getState()
    if (store.phase !== 'playing') return

    const px = player?.x ?? 0
    const pz = player?.z ?? 0
    const py = player?.y ?? 0

    boltsRef.current.forEach((bolt, i) => {
      bolt.dist += bolt.speed * delta
      bolt.angle += delta * 0.15

      // Reset jika sudah keluar batas arena (radius > 25m)
      if (bolt.dist > 25) {
        bolt.dist = 3.5
        bolt.angle += Math.PI / 4 + Math.random() * 0.5
        bolt.height = Math.random() > 0.5 ? 0.35 : 1.5
        bolt.dodged = false
        bolt.label = l5Deeds[Math.floor(Math.random() * l5Deeds.length)]
        sound.playLaser()
      }

      const bx = Math.sin(bolt.angle) * bolt.dist
      const bz = Math.cos(bolt.angle) * bolt.dist
      const by = bolt.height

      const mesh = meshesRef.current[i]
      if (mesh) {
        mesh.position.set(bx, by, bz)
        mesh.rotation.y = bolt.angle + Math.PI / 2
      }

      // Deteksi tabrakan dengan pemain
      const distToPlayer = Math.hypot(px - bx, pz - bz)
      if (distToPlayer < 1.1) {
        const isLow = bolt.height < 0.8
        const jumpedOver = isLow && py > 0.45
        const crouchedUnder = !isLow && (player?.crouchT ?? 0) > 0.6

        if (jumpedOver || crouchedUnder) {
          if (!bolt.dodged) {
            bolt.dodged = true
            dodgeLaser()
          }
        } else {
          hitLaser(bolt.label || 'Sombong')
          bolt.dist = 28
        }
      }
    })
  })

  return (
    <group>
      {[0, 1, 2, 3].map((i) => {
        const initialBolt = boltsRef.current[i]
        return (
          <group
            key={i}
            ref={(el) => (meshesRef.current[i] = el)}
            position={[0, initialBolt.height, 0]}
          >
            {/* Tabung proyektil laser Pink Neon Bright */}
            <mesh rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.12, 0.12, 2.4, 16]} />
              <meshBasicMaterial color="#ff0077" toneMapped={false} />
            </mesh>
            {/* Inti Putih Terang */}
            <mesh rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.045, 0.045, 2.3, 12]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            {/* Floating 3D Badge Perilaku Buruk Level 5 */}
            <Billboard position={[0, 0.85, 0]}>
              <ArenaBoltBadge3D label={initialBolt.label} low={initialBolt.height < 0.8} />
            </Billboard>
          </group>
        )
      })}
    </group>
  )
}

/**
 * Butiran Soal Adab & Puzzle 3x3 Melayang di Arena Terbuka:
 * - Menyala lembut, melayang naik-turun.
 * - Berinteraksi saat didekati pemain (< 2.6m).
 */
function AdabCollectibleOrbs() {
  const collectedOrbs = useGameStore((s) => s.collectedOrbs || [])
  const openLevel5Orb = useGameStore((s) => s.openLevel5Orb)
  const phase = useGameStore((s) => s.phase)

  const groupRef = useRef()

  useFrame(() => {
    if (phase !== 'playing') return
    const px = player?.x ?? 0
    const pz = player?.z ?? 0

    LEVEL_5_ORBS.forEach((orb) => {
      if (collectedOrbs.includes(orb.id)) return
      const dist = Math.hypot(px - orb.x, pz - orb.z)
      if (dist < 2.5) {
        openLevel5Orb(orb.id)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {LEVEL_5_ORBS.map((orb) => {
        const isCollected = collectedOrbs.includes(orb.id)
        if (isCollected) {
          return (
            <group key={orb.id} position={[orb.x, 0, orb.z]}>
              <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.6, 0.7, 0.3, 16]} />
                <meshStandardMaterial color="#86efac" roughness={0.3} />
              </mesh>
              <Billboard position={[0, 1.2, 0]}>
                <mesh>
                  <planeGeometry args={[0.9, 0.9]} />
                  <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
                </mesh>
              </Billboard>
            </group>
          )
        }

        const isPuzzle = orb.kind === 'puzzle'

        return (
          <FloatingOrbMesh key={orb.id} orb={orb} isPuzzle={isPuzzle} />
        )
      })}
    </group>
  )
}

function FloatingOrbMesh({ orb, isPuzzle }) {
  const meshRef = useRef()
  const ringRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 2.5 + orb.x) * 0.25
      meshRef.current.rotation.y += delta * 1.5
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 1.8
      ringRef.current.rotation.z += delta * 1.2
    }
  })

  const orbColor = isPuzzle ? '#06b6d4' : '#10b981'

  return (
    <group position={[orb.x, 0, orb.z]}>
      {/* Landasan bercahaya di lantai */}
      <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.6, 1.1, 24]} />
        <meshBasicMaterial color={orbColor} transparent opacity={0.4} />
      </mesh>

      {/* Butiran Orb Melayang */}
      <group ref={meshRef} position={[0, 1.4, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.65, 24, 24]} />
          <meshStandardMaterial
            color={orbColor}
            emissive={orbColor}
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        <mesh ref={ringRef}>
          <torusGeometry args={[0.95, 0.05, 12, 32]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* Billboard Teks di Atas Orb */}
        <Billboard position={[0, 1.2, 0]}>
          <OrbBanner3D label={isPuzzle ? '🧩 PUZZLE 3x3' : '✨ BUTIRAN SOAL'} isPuzzle={isPuzzle} />
        </Billboard>
      </group>
    </group>
  )
}

function OrbBanner3D({ label, isPuzzle }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 384
    canvas.height = 96
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()

    ctx.fillStyle = isPuzzle ? 'rgba(8, 145, 178, 0.92)' : 'rgba(16, 185, 129, 0.92)'
    ctx.beginPath()
    ctx.roundRect(8, 8, 368, 80, 40)
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 192, 48)

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [label, isPuzzle])

  return (
    <mesh>
      <planeGeometry args={[2.0, 0.5]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

/**
 * Tembakan Peluru Pistol Air Berbasis Ref Pool (High Performance, 0 React Re-renders inside useFrame):
 * Menembak dari pemain menuju Sumber Laser di tengah lapangan (0, 3.5, 0).
 */
function WaterProjectilesHandler() {
  const MAX_P = 8
  const touch = useGameStore((s) => s.touch)
  const shootWater = useGameStore((s) => s.shootWater)
  const damageTower = useGameStore((s) => s.damageTower)
  const waterShotTrigger = useGameStore((s) => s.waterShotTrigger)

  const pool = useRef(
    Array.from({ length: MAX_P }, () => ({
      active: false,
      x: 0,
      y: 0,
      z: 0,
      life: 0,
    }))
  )
  const meshesRef = useRef([])
  const lastShotTime = useRef(0)
  const lastTriggerRef = useRef(waterShotTrigger)

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime

    // Trigger tembakan dari keyboard ('F') / mouse / touch
    const triggerFromStore = waterShotTrigger !== lastTriggerRef.current
    if (triggerFromStore) {
      lastTriggerRef.current = waterShotTrigger
      const slot = pool.current.find((p) => !p.active)
      if (slot) {
        slot.active = true
        slot.x = player?.x ?? 0
        slot.y = (player?.y ?? 0) + 1.2
        slot.z = player?.z ?? 18
        slot.life = 2.4
      }
    } else if (touch.shoot && now - lastShotTime.current > 0.35) {
      if (shootWater()) {
        lastShotTime.current = now
        lastTriggerRef.current = useGameStore.getState().waterShotTrigger
        const slot = pool.current.find((p) => !p.active)
        if (slot) {
          slot.active = true
          slot.x = player?.x ?? 0
          slot.y = (player?.y ?? 0) + 1.2
          slot.z = player?.z ?? 18
          slot.life = 2.4
        }
      }
    }

    // Gerakkan proyektil aktif menuju menara
    pool.current.forEach((p, i) => {
      const mesh = meshesRef.current[i]
      if (!mesh) return

      if (!p.active) {
        mesh.visible = false
        return
      }

      mesh.visible = true

      // Arah menuju inti tower (0, 4.2, 0)
      const target = new THREE.Vector3(0, 4.2, 0)
      const current = new THREE.Vector3(p.x, p.y, p.z)
      const dir = target.sub(current).normalize()

      const speed = 25.0
      p.x += dir.x * speed * delta
      p.y += dir.y * speed * delta
      p.z += dir.z * speed * delta
      p.life -= delta

      mesh.position.set(p.x, p.y, p.z)

      const distToCenter = Math.hypot(p.x, p.z)
      if (distToCenter < 2.0) {
        // Tembakan air mengenai inti Sumber Laser!
        p.active = false
        mesh.visible = false
        damageTower()
      } else if (p.life <= 0) {
        p.active = false
        mesh.visible = false
      }
    })
  })

  return (
    <group>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <group
          key={i}
          ref={(el) => (meshesRef.current[i] = el)}
          visible={false}
        >
          {/* Proyektil Percikan Air Biru Berpendar Terang */}
          <mesh>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.48, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
          </mesh>
          {/* Butiran ekor air */}
          <mesh position={[0, 0, 0.35]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Pagar Pembatas Lingkaran Arena Terbuka */
function ArenaPerimeter() {
  const RADIUS = 25
  const posts = useMemo(() => {
    const list = []
    const count = 36
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      list.push({
        x: Math.sin(angle) * RADIUS,
        z: Math.cos(angle) * RADIUS,
        angle,
      })
    }
    return list
  }, [])

  return (
    <group>
      {posts.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation-y={p.angle}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 1.2, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Rel melingkar atas */}
      <mesh position={[0, 1.0, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[RADIUS, 0.07, 16, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  )
}

/**
 * Komponen Utama Level 5: LaserTowerArena
 * Arena terbuka luas dengan Sumber Laser di tengah, butiran soal, dan tembakan pistol air.
 */
export default function LaserTowerArena() {
  const towerHp = useGameStore((s) => s.towerHp ?? 8)
  const towerMaxHp = useGameStore((s) => s.towerMaxHp ?? 8)

  return (
    <group>
      {/* Hamparan Rumput Hijau Luas di Luar Arena */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#86efac" roughness={0.3} />
      </mesh>

      {/* Lantai Lapangan Arena Terbuka (Circular Plaza) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.05} />
      </mesh>

      {/* Pola Cincin Lapangan Arena */}
      {[8, 16, 24].map((r) => (
        <mesh key={r} rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
          <ringGeometry args={[r - 0.1, r + 0.1, 64]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
      ))}

      {/* PEMBATAS ARENA: Dinding Pembatas Tak Terlihat (Invisible Boundary Walls) */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[24.2, 24.2, 12, 48, 1, true]} />
        <meshBasicMaterial visible={false} transparent opacity={0} />
      </mesh>

      {/* Indikator Garis Pembatas Lingkaran Lapangan */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[23.6, 24.0, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Pagar Keliling Arena */}
      <ArenaPerimeter />

      {/* Menara Pemancar Laser di Tengah */}
      <LaserEmitterTower towerHp={towerHp} towerMaxHp={towerMaxHp} />

      {/* Tembakan Laser Bolting dari Menara */}
      <ArenaTowerLasers />

      {/* Butiran Soal Adab & Mini-Game Puzzle 3x3 */}
      <AdabCollectibleOrbs />

      {/* Penanganan Tembakan Pistol Air Pemain */}
      <WaterProjectilesHandler />
    </group>
  )
}
