import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Instance, Instances } from '@react-three/drei'
import * as THREE from 'three'
import { CHECKPOINTS, CORRIDOR_WIDTH, FINISH_Z, PALETTE, START_Z } from '../../config/track'
import { useGameStore } from '../../store/gameStore'

const HALF_W = CORRIDOR_WIDTH / 2
const FLOOR_START = START_Z + 12
const FLOOR_END = FINISH_Z - 14
const FLOOR_LEN = FLOOR_START - FLOOR_END
const FLOOR_MID = (FLOOR_START + FLOOR_END) / 2

function seeded(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

/** Tekstur lantai koridor modern & bersih (grid pastel ala AI Studio). */
/** Tekstur lantai koridor tematik per level (1: Masjid, 2: Rumah, 3: Sekolah, 4: Hutan). */
function useThematicFloorTexture(level) {
  return useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')

    if (level === 1) {
      // Level 1 (Masjid): Marmer putih suci dengan lis emas & karpet zamrud tengah
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, size, size)
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)'
      ctx.lineWidth = 6
      ctx.strokeRect(6, 6, size - 12, size - 12)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'
      ctx.fillRect(size * 0.25, 0, size * 0.5, size)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)'
      ctx.lineWidth = 3
      ctx.strokeRect(size * 0.25, 0, size * 0.5, size)
    } else if (level === 2) {
      // Level 2 (Rumah): Paving batu hangat pemukiman (cobblestone terracotta)
      ctx.fillStyle = '#fef3c7'
      ctx.fillRect(0, 0, size, size)
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)'
      ctx.lineWidth = 4
      const step = 64
      for (let y = 0; y < size; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke()
      }
      for (let x = 0; x < size; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke()
      }
      ctx.fillStyle = '#f97316'
      ctx.fillRect(0, 0, 24, size)
      ctx.fillRect(size - 24, 0, 24, size)
    } else if (level === 3) {
      // Level 3 (Sekolah): Lintasan sepeda / olahraga sekolah kartun ceria
      ctx.fillStyle = '#e0f2fe'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#0284c7'
      ctx.fillRect(30, 0, size - 60, size)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 8
      ctx.setLineDash([28, 20])
      ctx.beginPath()
      ctx.moveTo(size / 2, 0)
      ctx.lineTo(size / 2, size)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#facc15'
      ctx.fillRect(20, 0, 10, size)
      ctx.fillRect(size - 30, 0, 10, size)
    } else {
      // Level 4 (Hutan & Alam): Setapak kayu & batu alam dikelilingi rumput hijau segar
      ctx.fillStyle = '#dcfce7'
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#b45309'
      for (let y = 16; y < size; y += 64) {
        ctx.fillRect(40, y, size - 80, 24)
      }
      ctx.fillStyle = '#15803d'
      ctx.fillRect(0, 0, 24, size)
      ctx.fillRect(size - 24, 0, 24, size)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(CORRIDOR_WIDTH / 2, FLOOR_LEN / 2)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [level])
}

/** Pembatas koridor tematik sesuai level (Pilar marmer, pagar kayu kartun, rel sekolah, pagar bambu). */
function ThematicRails({ level }) {
  const posts = useMemo(() => {
    const list = []
    let i = 0
    for (let z = FLOOR_START; z >= FLOOR_END; z -= 3.5, i++) {
      let color = PALETTE.white
      if (level === 1) color = i % 2 ? '#ffffff' : '#fef08a'
      else if (level === 2) color = i % 2 ? '#f59e0b' : '#b45309'
      else if (level === 3) color = i % 2 ? '#38bdf8' : '#fbbf24'
      else color = i % 2 ? '#22c55e' : '#15803d'

      list.push({ p: [-HALF_W - 0.25, 0.55, z], color })
      list.push({ p: [HALF_W + 0.25, 0.55, z], color })
    }
    return list
  }, [level])

  const railColor =
    level === 1
      ? '#ffffff'
      : level === 2
      ? '#d97706'
      : level === 3
      ? '#0284c7'
      : '#15803d'

  return (
    <group>
      {/* Tiang pembatas silinder halus */}
      <Instances limit={posts.length} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.14, 1.1, 16]} />
        <meshStandardMaterial roughness={0.25} metalness={0.1} />
        {posts.map(({ p, color }, i) => (
          <Instance key={i} position={p} color={color} />
        ))}
      </Instances>

      {/* Kepala tiang bulat halus */}
      <Instances limit={posts.length} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial roughness={0.2} metalness={0.1} />
        {posts.map(({ p, color }, i) => (
          <Instance key={i} position={[p[0], 1.1, p[2]]} color={color} />
        ))}
      </Instances>

      {/* Pipa pegangan pagar memanjang & pelindung kaki */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * (HALF_W + 0.25), 0.95, FLOOR_MID]}
            rotation-x={Math.PI / 2}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.06, FLOOR_LEN, 16]} />
            <meshStandardMaterial color={railColor} roughness={0.25} metalness={0.1} />
          </mesh>
          <mesh
            position={[side * (HALF_W + 0.25), 0.08, FLOOR_MID]}
            receiveShadow
          >
            <boxGeometry args={[0.35, 0.16, FLOOR_LEN]} />
            <meshStandardMaterial color={railColor} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Gerbang Lurus Bersih: START & FINISH (Bebas Lengkungan / 100% Straight) */
function StraightGate({ z, color, label }) {
  const columnH = 3.2
  const halfSpan = (CORRIDOR_WIDTH + 0.5) / 2

  return (
    <group position={[0, 0, z]}>
      {/* Dua tiang vertikal lurus silinder di sisi kiri & kanan */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * halfSpan, 0, 0]}>
          <mesh position={[0, columnH / 2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, columnH, 16]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
          </mesh>
          <mesh position={[0, columnH + 0.1, 0]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Balok lurus melintang horizontal atas */}
      <mesh position={[0, columnH, 0]} castShadow>
        <boxGeometry args={[CORRIDOR_WIDTH + 0.8, 0.32, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
      </mesh>

      {/* Garis batas di lantai */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.009, 0]}>
        <planeGeometry args={[CORRIDOR_WIDTH, 0.6]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Label 3D melayang di atas balok lurus */}
      <Billboard position={[0, columnH + 0.65, 0]}>
        <GateBanner3D label={label} done={false} />
      </Billboard>
    </group>
  )
}

/** Butiran / Orb Adab Bercahaya di Tengah Jalan Lurus (Saat Kapsul Lewat Langsung Pop-up Kuis) */
function AdabCheckpointOrb({ z, index, done = false }) {
  const orbRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (orbRef.current) {
      orbRef.current.position.y = 1.25 + Math.sin(t * 3 + index) * 0.12
      orbRef.current.rotation.y = t * 1.6
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 2.2
      ringRef.current.rotation.z = t * 1.4
    }
  })

  return (
    <group position={[0, 0, z]}>
      {/* Garis Penanda Checkpoint Bersih di Lantai Koridor Lurus */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.009, 0]}>
        <planeGeometry args={[CORRIDOR_WIDTH, 0.45]} />
        <meshBasicMaterial color={done ? '#22c55e' : '#facc15'} />
      </mesh>

      {/* Butiran Orb Bercahaya Mengambang di Tengah Jalan Lurus */}
      <group ref={orbRef} position={[0, 1.25, 0]}>
        {/* Bola pendar luar */}
        <mesh>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial
            color={done ? '#22c55e' : '#facc15'}
            transparent
            opacity={done ? 0.3 : 0.65}
          />
        </mesh>

        {/* Inti kristal berpendar */}
        <mesh>
          <octahedronGeometry args={[0.24]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* Cincin orbit berputar lembut saat belum selesai */}
        {!done && (
          <mesh ref={ringRef}>
            <torusGeometry args={[0.6, 0.025, 16, 32]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
        )}

        {/* Label 3D Melayang di Atas Orb */}
        <Billboard position={[0, 0.85, 0]}>
          <GateBanner3D
            label={done ? `✓ Kuis ${index + 1} Selesai` : `✨ Kuis Adab ${index + 1}`}
            done={done}
          />
        </Billboard>
      </group>
    </group>
  )
}

function GateBanner3D({ label, done }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 512, 128)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
    ctx.beginPath()
    ctx.roundRect(12, 12, 488, 104, 52)
    ctx.fill()
    ctx.lineWidth = 6
    ctx.strokeStyle = done ? '#4ade80' : '#38bdf8'
    ctx.stroke()

    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 44px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${done ? '✓ ' : '★ '}${label}`, 256, 64)

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [label, done])

  return (
    <mesh>
      <planeGeometry args={[3.2, 0.8]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}

/** Awan 3D Lembut & Ramah Anak (Puffy Soft Clouds). */
function SoftPuffyClouds() {
  const group = useRef()
  const clouds = useMemo(() => {
    const rand = seeded(88)
    return Array.from({ length: 18 }, () => ({
      x: (rand() - 0.5) * 85,
      y: 14 + rand() * 10,
      z: START_Z + 15 - rand() * 250,
      s: 1.4 + rand() * 1.8,
    }))
  }, [])

  useFrame((state) => {
    if (group.current) {
      group.current.position.x = Math.sin(state.clock.elapsedTime * 0.035) * 10
    }
  })

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
          {/* Kumpulan bola bulat halus bertumpuk membentuk awan empuk */}
          {[
            [0, 0, 0, 1.1],
            [0.9, -0.15, 0.15, 0.85],
            [-0.9, -0.18, -0.1, 0.8],
            [0.35, 0.4, -0.15, 0.75],
            [-0.4, 0.35, 0.15, 0.7],
          ].map(([x, y, z, r], j) => (
            <mesh key={j} position={[x, y, z]}>
              <sphereGeometry args={[r, 20, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.2}
                metalness={0.05}
                emissive="#f0f9ff"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** 1. Pemandangan Latar Level 1 (Masjid): Koridor pilar arsitektur masjid, kubah minimalis, pohon kurma, kolam tenang */
function MosqueScenery() {
  const colonnades = useMemo(() => {
    const list = []
    for (let z = START_Z + 10; z > FINISH_Z - 10; z -= 8.0) {
      list.push({ z })
    }
    return list
  }, [])

  return (
    <group>
      {/* Kolam Air Tenang di Samping Koridor */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (HALF_W + 7), 0.01, FLOOR_MID]}>
          <mesh rotation-x={-Math.PI / 2}>
            <planeGeometry args={[6.5, FLOOR_LEN]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Lis Marmer Kolam */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[6.8, 0.16, FLOOR_LEN]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Barisan Pilar Arsitektur Marmer Masjid Bersih di Sepanjang Koridor */}
      {colonnades.map(({ z }, idx) => (
        <group key={idx}>
          {[-1, 1].map((side) => {
            const x = side * (HALF_W + 3.2)
            return (
              <group key={side} position={[x, 0, z]}>
                {/* Pondasi pilar */}
                <mesh position={[0, 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.35, 0.45, 0.4, 16]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
                </mesh>
                {/* Batang pilar marmer */}
                <mesh position={[0, 2.2, 0]} castShadow>
                  <cylinderGeometry args={[0.22, 0.25, 3.6, 20]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.1} />
                </mesh>
                {/* Kepala pilar berornamen emas */}
                <mesh position={[0, 4.1, 0]} castShadow>
                  <cylinderGeometry args={[0.38, 0.25, 0.35, 16]} />
                  <meshStandardMaterial color="#fef08a" roughness={0.2} metalness={0.3} />
                </mesh>
                {/* Kubah pastel kecil di atas pilar */}
                <mesh position={[0, 4.5, 0]} castShadow>
                  <sphereGeometry args={[0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial color="#34d399" roughness={0.2} metalness={0.1} />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      {/* Pohon Kurma Minimalis di Taman Masjid */}
      {[-1, 1].map((side) =>
        [-20, -60, -100, -140, -180].map((pz, i) => (
          <group key={`${side}-${i}`} position={[side * (HALF_W + 12), 0, pz]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.28, 5.0, 10]} />
              <meshStandardMaterial color="#78350f" roughness={0.5} />
            </mesh>
            {/* Pelepah kurma melengkung */}
            {[0, 1, 2, 3, 4, 5].map((angleIdx) => (
              <mesh
                key={angleIdx}
                position={[0, 5.0, 0]}
                rotation-y={(angleIdx * Math.PI) / 3}
                rotation-z={0.55}
                castShadow
              >
                <boxGeometry args={[2.2, 0.08, 0.35]} />
                <meshStandardMaterial color="#15803d" roughness={0.3} />
              </mesh>
            ))}
          </group>
        ))
      )}
    </group>
  )
}

/** 2. Pemandangan Latar Level 2 (Rumah): Lingkungan pemukiman hangat, pagar kayu kartun rounded, rumah-rumah simpel */
function ResidentialScenery() {
  const houses = useMemo(() => {
    const list = []
    const houseColors = ['#fde047', '#38bdf8', '#f97316', '#a78bfa', '#f472b6', '#34d399']
    const roofColors = ['#ea580c', '#0284c7', '#7c3aed', '#b45309', '#059669']
    let cIdx = 0

    for (let z = START_Z + 4; z > FINISH_Z + 12; z -= 14) {
      for (const side of [-1, 1]) {
        list.push({
          x: side * (HALF_W + 9.5),
          z,
          side,
          wallColor: houseColors[cIdx % houseColors.length],
          roofColor: roofColors[cIdx % roofColors.length],
        })
        cIdx++
      }
    }
    return list
  }, [])

  return (
    <group>
      {/* Rumah-Rumah Kartun Simpel Berjendela Hangat */}
      {houses.map((h, i) => (
        <group key={i} position={[h.x, 0, h.z]} rotation-y={h.side > 0 ? -Math.PI / 2 : Math.PI / 2}>
          {/* Badan Rumah */}
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.5, 4.0, 5.5]} />
            <meshStandardMaterial color={h.wallColor} roughness={0.3} metalness={0.05} />
          </mesh>
          {/* Atap Pelana Rumah */}
          <mesh position={[0, 4.6, 0]} rotation-y={Math.PI / 4} castShadow>
            <coneGeometry args={[4.8, 2.2, 4]} />
            <meshStandardMaterial color={h.roofColor} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Cerobong Asap Kartun */}
          <mesh position={[1.4, 5.2, 0]} castShadow>
            <boxGeometry args={[0.6, 1.2, 0.6]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
          {/* Pintu Depan Kayu */}
          <mesh position={[0, 1.2, 2.8]}>
            <boxGeometry args={[1.4, 2.4, 0.15]} />
            <meshStandardMaterial color="#78350f" roughness={0.3} />
          </mesh>
          {/* Jendela Kotak Kartun */}
          {[-1.6, 1.6].map((wx) => (
            <mesh key={wx} position={[wx, 2.2, 2.8]}>
              <boxGeometry args={[1.2, 1.2, 0.12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} emissive="#fef08a" emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Pagar Kayu Kartun Rounded & Lampu Taman Hangat */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {[-15, -45, -75, -105, -135, -165].map((pz, idx) => (
            <group key={idx} position={[side * (HALF_W + 2.5), 0, pz]}>
              {/* Tiang Lampu Jalan Kartun */}
              <mesh position={[0, 1.6, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 3.2, 12]} />
                <meshStandardMaterial color="#475569" roughness={0.3} />
              </mesh>
              {/* Kepala Lampu Menyala Kuning Hangat */}
              <mesh position={[0, 3.3, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

/** 3. Pemandangan Latar Level 3 (Sekolah): Halaman sekolah cerah, gedung kelas low-poly, ring olahraga, warna ceria */
function SchoolScenery() {
  const classrooms = useMemo(() => {
    const list = []
    for (let z = START_Z + 2; z > FINISH_Z + 14; z -= 26) {
      for (const side of [-1, 1]) {
        list.push({
          x: side * (HALF_W + 12),
          z,
          side,
        })
      }
    }
    return list
  }, [])

  return (
    <group>
      {/* Gedung-Gedung Kelas Sekolah Low-Poly */}
      {classrooms.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]} rotation-y={c.side > 0 ? -Math.PI / 2 : Math.PI / 2}>
          {/* Bangunan Kelas Bertingkat */}
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[14, 7.0, 7.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.05} />
          </mesh>
          {/* Atap Sekolah Biru/Oranye */}
          <mesh position={[0, 7.4, 0]} castShadow>
            <boxGeometry args={[14.8, 0.8, 8.2]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.1} />
          </mesh>
          {/* Deretan Jendela Kelas */}
          {[-4.5, -1.5, 1.5, 4.5].map((jx) => (
            <group key={jx}>
              <mesh position={[jx, 2.2, 3.8]}>
                <boxGeometry args={[1.8, 1.8, 0.1]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.2} />
              </mesh>
              <mesh position={[jx, 5.0, 3.8]}>
                <boxGeometry args={[1.8, 1.8, 0.1]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Fasilitas Olahraga Sekolah di Pinggir Lintasan Sepeda */}
      {[-1, 1].map((side) =>
        [-35, -95, -155].map((pz, idx) => (
          <group key={`${side}-${idx}`} position={[side * (HALF_W + 4.2), 0, pz]}>
            {/* Tiang Ring Basket Sekolah */}
            <mesh position={[0, 2.0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.08, 4.0, 12]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} />
            </mesh>
            {/* Papan Pantul */}
            <mesh position={[side > 0 ? -0.4 : 0.4, 3.8, 0]}>
              <boxGeometry args={[0.1, 1.1, 1.4]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

/** 4. Pemandangan Latar Level 4 (Hutan & Alam): Kebun/taman asri, pohon rounded kartun, bunga low-poly, 0 avatar hewan */
function NatureScenery() {
  const trees = useMemo(() => {
    const list = []
    const greens = ['#15803d', '#166534', '#22c55e', '#4ade80', '#047857']
    const rand = seeded(88)

    for (let z = START_Z + 12; z > FINISH_Z - 10; z -= 5.5) {
      for (const side of [-1, 1]) {
        const x = side * (HALF_W + 3.5 + rand() * 12)
        const scale = 0.9 + rand() * 0.8
        const color = greens[Math.floor(rand() * greens.length)]
        list.push({ x, z: z + rand() * 3, scale, color })
      }
    }
    return list
  }, [])

  const flowerPatches = useMemo(() => {
    const list = []
    const fColors = ['#f472b6', '#fbbf24', '#c084fc', '#ffffff', '#38bdf8']
    const rand = seeded(55)

    for (let z = START_Z + 8; z > FINISH_Z - 5; z -= 8.0) {
      for (const side of [-1, 1]) {
        list.push({
          x: side * (HALF_W + 2.0 + rand() * 4),
          z,
          color: fColors[Math.floor(rand() * fColors.length)],
        })
      }
    }
    return list
  }, [])

  return (
    <group>
      {/* Rumpun Pohon Rounded Kartun Lebat Aneka Nuansa Hijau */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.scale}>
          {/* Batang Pohon Cokelat Alami */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 2.2, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.45} />
          </mesh>
          {/* Tajuk Daun Bulat Bertingkat */}
          <mesh position={[0, 2.7, 0]} castShadow>
            <sphereGeometry args={[1.3, 16, 16]} />
            <meshStandardMaterial color={t.color} roughness={0.3} metalness={0.05} />
          </mesh>
          <mesh position={[0.2, 3.6, -0.1]} castShadow>
            <sphereGeometry args={[0.9, 14, 14]} />
            <meshStandardMaterial color={t.color} roughness={0.3} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* Rumpun Bunga-Bunga Low-Poly Mekar Cantik di Tepi Hutan (Tanpa Hewan) */}
      {flowerPatches.map((f, i) => (
        <group key={i} position={[f.x, 0.12, f.z]}>
          <mesh rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.5, 8]} />
            <meshStandardMaterial color="#86efac" roughness={0.4} />
          </mesh>
          {/* Kuncup Bunga */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color={f.color} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Batu Kali Alami Halus */}
      {[-1, 1].map((side) =>
        [-25, -65, -115, -165].map((pz, idx) => (
          <mesh
            key={`${side}-${idx}`}
            position={[side * (HALF_W + 3.0), 0.25, pz]}
            rotation-y={idx}
            castShadow
          >
            <dodecahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  )
}

/** Masjid kubah minimalis sebagai tujuan akhir. */
function MosqueGoal() {
  const z = FINISH_Z - 26
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[18, 0.4, 14]} />
        <meshStandardMaterial color={PALETTE.cream} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 4.8, 7.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Kubah utama hijau pastel */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <sphereGeometry args={[2.7, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#34d399" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Puncak bulan bintang emas */}
      <mesh position={[0, 8.1, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={PALETTE.sun}
          emissive={PALETTE.sun}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      {/* Menara kembar dengan kubah pastel */}
      {[-6.5, 6.5].map((x) => (
        <group key={x} position={[x, 0, 1.5]}>
          <mesh position={[0, 4.2, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.65, 8.4, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
          <mesh position={[0, 8.8, 0]} castShadow>
            <coneGeometry args={[0.7, 1.6, 20]} />
            <meshStandardMaterial color="#34d399" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Sekolah minimalis modern sebagai tujuan Level 2. */
function SchoolGoal() {
  const z = FINISH_Z - 26
  return (
    <group position={[0, 0, z]}>
      {/* Halaman / Pelataran */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[20, 0.4, 14]} />
        <meshStandardMaterial color={PALETTE.cream} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Gedung Sekolah Utama */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 5.6, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Atap Sekolah Merah Bata Halus */}
      <mesh position={[0, 6.4, 0]} castShadow>
        <boxGeometry args={[15, 0.8, 9]} />
        <meshStandardMaterial color="#ea580c" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Tiang Bendera */}
      <mesh position={[0, 4.0, 5.5]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Bendera Merah Putih Minimalis */}
      <group position={[0.6, 7.2, 5.5]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.2, 0.5, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[1.2, 0.5, 0.04]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      {/* Papan Nama Sekolah */}
      <Billboard position={[0, 4.8, 4.1]}>
        <mesh>
          <planeGeometry args={[4.2, 1.2]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </Billboard>
    </group>
  )
}

/** Rumah idaman minimalis sebagai tujuan Level 3. */
function HouseGoal() {
  const z = FINISH_Z - 26
  return (
    <group position={[0, 0, z]}>
      {/* Halaman Depan Rumah */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[16, 0.4, 14]} />
        <meshStandardMaterial color="#fef08a" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Bangunan Rumah */}
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 4.8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Atap Segitiga Rumah */}
      <mesh position={[0, 5.8, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[7.2, 2.6, 4]} />
        <meshStandardMaterial color="#f97316" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Teras & Pintu Rumah */}
      <mesh position={[0, 1.6, 4.1]}>
        <boxGeometry args={[2.0, 3.0, 0.2]} />
        <meshStandardMaterial color="#854d0e" roughness={0.3} />
      </mesh>
    </group>
  )
}

/** Hutan asri minimalis sebagai tujuan Level 4. */
function NatureGoal() {
  const z = FINISH_Z - 26
  return (
    <group position={[0, 0, z]}>
      {/* Landasan Taman Rumput Asri */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[22, 0.4, 16]} />
        <meshStandardMaterial color="#4ade80" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Gerbang Kayu Suaka Hutan */}
      <group position={[0, 0, 5]}>
        {[-4, 4].map((x) => (
          <mesh key={x} position={[x, 2.4, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 4.8, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
        ))}
        {/* Balok kayu melintang atas */}
        <mesh position={[0, 4.6, 0]} castShadow>
          <boxGeometry args={[9.2, 0.45, 0.45]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Papan Selamat Datang di Hutan Asri */}
        <Billboard position={[0, 3.8, 0]}>
          <mesh>
            <planeGeometry args={[5.2, 0.9]} />
            <meshBasicMaterial color="#065f46" />
          </mesh>
        </Billboard>
      </group>

      {/* Air Mancur Batu Alami di Tengah */}
      <group position={[0, 0.3, -1]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2.4, 2.8, 0.6, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} />
        </mesh>
        {/* Air jernih */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[2.1, 2.1, 0.1, 24]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
        {/* Pilar batu air mancur */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.6, 1.8, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} />
        </mesh>
      </group>

      {/* Rumpun Pohon Lindung Rimba Asri */}
      {[
        [-6, 0, -4, 1.4, '#15803d'],
        [6, 0, -4, 1.3, '#166534'],
        [-8, 0, 2, 1.1, '#22c55e'],
        [8, 0, 2, 1.2, '#15803d'],
        [-3, 0, -6, 1.5, '#14532d'],
        [3, 0, -6, 1.5, '#166534'],
      ].map(([x, y, pz, s, col], i) => (
        <group key={i} position={[x, y, pz]} scale={s}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.28, 2.4, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow>
            <sphereGeometry args={[1.3, 16, 16]} />
            <meshStandardMaterial color={col} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Komponen utama Arena 3D:
 * Menggabungkan lantai koridor modern, pagar pembatas sleek, gerbang lengkung minimalis,
 * awan 3D lembut, dan pemandangan pastel ala AI Studio.
 */
export default function Arena({ checkpointIndex = 0 }) {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const floorTex = useThematicFloorTexture(currentLevel)

  const finishLabel =
    currentLevel === 1
      ? '🏁 FINISH MASJID'
      : currentLevel === 2
      ? '🏁 FINISH RUMAH'
      : currentLevel === 3
      ? '🏁 FINISH SEKOLAH'
      : '🏁 FINISH HUTAN ASRI'

  return (
    <group>
      {/* Hamparan rumput pastel lembut di luar koridor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.08, -100]} receiveShadow>
        <planeGeometry args={[350, 450]} />
        <meshStandardMaterial
          color={currentLevel === 4 ? '#4ade80' : PALETTE.grass}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Lantai koridor tematik per level */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, FLOOR_MID]} receiveShadow>
        <planeGeometry args={[CORRIDOR_WIDTH, FLOOR_LEN]} />
        <meshStandardMaterial
          map={floorTex}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Pembatas koridor tematik per level */}
      <ThematicRails level={currentLevel} />

      {/* Gerbang Lurus Bersih: START */}
      <StraightGate
        z={START_Z}
        color="#38bdf8"
        label="START ADABKU"
      />

      {/* Butiran / Orb Bercahaya di Tengah Jalan Lurus: Checkpoints Kuis Adab */}
      {CHECKPOINTS.map((z, i) => (
        <AdabCheckpointOrb
          key={z}
          z={z}
          index={i}
          done={checkpointIndex > i}
        />
      ))}

      {/* Gerbang Lurus Bersih: FINISH */}
      <StraightGate
        z={FINISH_Z}
        color={PALETTE.orange}
        label={finishLabel}
      />

      {/* Dekorasi Awan 3D Lembut */}
      <SoftPuffyClouds />

      {/* Pemandangan Latar Belakang Tematik Khusus Per Level */}
      {currentLevel === 1 && <MosqueScenery />}
      {currentLevel === 2 && <ResidentialScenery />}
      {currentLevel === 3 && <SchoolScenery />}
      {currentLevel === 4 && <NatureScenery />}

      {/* Landmark Tujuan Akhir Lintasan */}
      {currentLevel === 1 && <MosqueGoal />}
      {currentLevel === 2 && <HouseGoal />}
      {currentLevel === 3 && <SchoolGoal />}
      {currentLevel === 4 && <NatureGoal />}
    </group>
  )
}


