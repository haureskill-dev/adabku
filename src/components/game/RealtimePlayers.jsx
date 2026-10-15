import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { player } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'
import { multiplayerService } from '../../services/multiplayer'
import CapsuleCharacter from './CapsuleCharacter'

/**
 * 3D Floating Name Tag di atas Kapsul Pemain Asli (Real-Time Multiplayer).
 * Menggunakan Three.js Billboard + CanvasTexture native yang bebas crash dan tajam.
 */
function RemotePlayerNametag({ name, color = '#38bdf8', level = 1, gender = 'laki-laki' }) {
  const tex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 110
    const ctx = canvas.getContext('2d')
    if (!ctx) return new THREE.Texture()

    ctx.clearRect(0, 0, 400, 110)

    // Background pill solid elegan
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)'
    ctx.beginPath()
    ctx.roundRect(10, 10, 380, 90, 45)
    ctx.fill()

    // Border berwarna khas kapsul pemain
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.stroke()

    // Bulatan status online hijau
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(44, 55, 11, 0, Math.PI * 2)
    ctx.fill()

    // Teks Nama Pemain Asli
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(name.slice(0, 13), 68, 44)

    // Subtitle Karakter & Level
    const genderLabel = gender === 'perempuan' ? 'Berjilbab' : 'Topi SD'
    ctx.fillStyle = color
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(`LV.${level} • ${genderLabel} • Teman Adab`, 68, 75)

    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [name, color, level, gender])

  return (
    <mesh position={[0, 2.35, 0]}>
      <planeGeometry args={[2.3, 0.68]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

/** Representasi Kapsul Pemain Asli dengan interpolasi posisi halus */
function RemoteCapsule({ data }) {
  const groupRef = useRef()
  const currentPos = useRef(new THREE.Vector3(data.x, data.y, data.z))
  const targetPos = useRef(new THREE.Vector3(data.x, data.y, data.z))
  const targetYaw = useRef(data.yaw || 0)
  const phase = useRef(0)

  // Perbarui target posisi setiap ada paket baru
  useEffect(() => {
    targetPos.current.set(data.x, data.y, data.z)
    targetYaw.current = data.yaw || 0
  }, [data.x, data.y, data.z, data.yaw])

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return

    // Interpolasi halus (lerp) pergerakan dan rotasi pemain lain
    currentPos.current.lerp(targetPos.current, Math.min(1, delta * 14))
    g.position.copy(currentPos.current)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw.current, 12, delta)

    // Hitung langkah kaki
    phase.current += delta * 10
  })

  const isGirl = String(data.gender).toLowerCase().includes('perempuan') || String(data.gender).toLowerCase().includes('girl')

  return (
    <group ref={groupRef} position={[data.x, data.y, data.z]}>
      {/* 3D Floating Name Tag di atas Kapsul */}
      <Billboard>
        <RemotePlayerNametag
          name={data.name}
          color={isGirl ? '#f43f5e' : '#0284c7'}
          level={data.level}
          gender={isGirl ? 'perempuan' : 'laki-laki'}
        />
      </Billboard>

      {/* 3D Kapsul Polos (Laki-laki Berpeci / Perempuan Berjilbab) */}
      <CapsuleCharacter
        gender={isGirl ? 'perempuan' : 'laki-laki'}
        color={isGirl ? '#f43f5e' : '#0284c7'}
        accentColor="#dc2626"
        crouchT={data.crouchT || 0}
        isJumping={Boolean(data.isJumping)}
        isWalking={true}
        forwardTilt={0.08}
        runPhase={phase.current}
        shields={0}
      />
    </group>
  )
}

/**
 * Komponen Manajer Multiplayer Real-Time:
 * - Menyiarkan posisi pemain lokal secara berkala (50ms interval / 20 FPS).
 * - Menangkap dan menampilkan pemain asli sesama pengguna yang terhubung secara real-time di room yang sama.
 */
export default function RealtimePlayers() {
  const playerName = useGameStore((s) => s.playerName)
  const playerGender = useGameStore((s) => s.playerGender)
  const roomCode = useGameStore((s) => s.roomCode)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const [remotePlayers, setRemotePlayers] = useState([])

  // Dengarkan daftar pemain lain yang terhubung di room
  useEffect(() => {
    multiplayerService.init(roomCode)
    const unsubscribe = multiplayerService.subscribe((list) => {
      setRemotePlayers(list)
    })

    return () => {
      unsubscribe()
      multiplayerService.destroy()
    }
  }, [roomCode])

  // Interval broadcast posisi 3D rutin (50ms ~ 20 FPS)
  useEffect(() => {
    const timer = setInterval(() => {
      const gStr = String(playerGender || 'boy').toLowerCase()
      const isGirl = gStr.includes('perempuan') || gStr.includes('girl')

      multiplayerService.broadcast({
        id: multiplayerService.myPeerId,
        name: playerName || (isGirl ? 'Aisyah' : 'Ahmad'),
        gender: isGirl ? 'perempuan' : 'laki-laki',
        position: [player?.x ?? 0, player?.y ?? 0, player?.z ?? 0],
        rotation: player?.yaw ?? 0,
        level: currentLevel,
        crouchT: player?.crouchT ?? 0,
        isJumping: (player?.y ?? 0) > 0.35,
      })
    }, 50)

    return () => clearInterval(timer)
  }, [playerName, playerGender, currentLevel])

  return (
    <group>
      {remotePlayers.map((p) => (
        <RemoteCapsule key={p.id} data={p} />
      ))}
    </group>
  )
}
