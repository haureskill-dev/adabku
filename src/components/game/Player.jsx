import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { PLAYER } from '../../config/controls'
import { BOUNDS } from '../../config/track'
import { player, resetPlayer } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'
import CapsuleCharacter from './CapsuleCharacter'

const NO_INPUT = { forward: false, backward: false, left: false, right: false, jump: false, crouch: false }
const _lookTarget = new THREE.Vector3()

export default function Player({ shields = 0 }) {
  const [, getKeys] = useKeyboardControls()
  const mouseNorm = useRef({ x: 0, y: 0, active: false })
  const playerGroup = useRef()

  const sim = useRef({
    x: 0,
    y: 0,
    z: 0,
    vy: 0,
    grounded: true,
    jumpHeld: false,
    phase: 0,
    steerTilt: 0,
    camX: 0,
    camY: 2.3,
    camZ: 4.8,
  })

  // Listener kursor mouse di desktop/laptop untuk arah kemudi & pandangan mulus
  useEffect(() => {
    resetPlayer()

    const handlePointerMove = (e) => {
      // Normalisasi -1 (kiri) s/d +1 (kanan)
      mouseNorm.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseNorm.current.y = (e.clientY / window.innerHeight) * 2 - 1
      mouseNorm.current.active = true
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05)
    const s = sim.current
    const store = useGameStore.getState()
    const active = store.phase === 'playing'

    // 1. Baca Input: Keyboard, Tombol Sentuh, Joystick, dan Kursor Mouse
    const k = active ? getKeys() : NO_INPUT
    const t = active ? store.touch : NO_INPUT
    const joy = active ? store.joystick : { x: 0, y: 0, active: false }

    let dx = Number(k.right || t.right) - Number(k.left || t.left)
    let dz = Number(k.backward || t.backward) - Number(k.forward || t.forward)

    // Gabungkan Virtual Joystick Mobile jika aktif
    if (joy.active) {
      dx += joy.x
      dz += joy.y
    }

    // Arah pandangan & kemudi kursor mouse di Laptop / Desktop
    if (mouseNorm.current.active && !joy.active && Math.abs(mouseNorm.current.x) > 0.05) {
      // Pembelokan halus mengikuti posisi kursor horizontal
      const mouseSteerInfluence = mouseNorm.current.x * 0.75
      dx += mouseSteerInfluence
    }

    // Batasi vektor gerakan
    const len = Math.hypot(dx, dz)
    if (len > 1) {
      dx /= len
      dz /= len
    }

    const jump = active && (k.jump || t.jump)
    const crouch = active && (k.crouch || t.crouch)

    if (active) player.time += dt

    /* ---------- Gerak horizontal koridor dengan kemudi mulus (Smooth Steering) ---------- */
    const speed = crouch && s.grounded ? PLAYER.crouchSpeed : PLAYER.walkSpeed
    const moving = Math.abs(dx) > 0.02 || Math.abs(dz) > 0.02

    if (moving) {
      s.x = THREE.MathUtils.clamp(s.x + dx * speed * dt, BOUNDS.minX, BOUNDS.maxX)
      s.z = THREE.MathUtils.clamp(s.z + dz * speed * dt, BOUNDS.minZ, BOUNDS.maxZ)
    }

    /* ---------- Kemiringan tubuh imut saat belok (Subtle Lateral Tilt) ---------- */
    s.steerTilt = THREE.MathUtils.damp(s.steerTilt, dx, 10, dt)

    /* ---------- Lompat & gravitasi presisi ---------- */
    if (jump && !s.jumpHeld && s.grounded) {
      s.vy = PLAYER.jumpVelocity
      s.grounded = false
    }
    s.jumpHeld = jump

    if (!s.grounded) {
      s.vy -= PLAYER.gravity * dt
      s.y += s.vy * dt
      if (s.y <= 0) {
        s.y = 0
        s.vy = 0
        s.grounded = true
      }
    }

    /* ---------- Animasi langkah & transisi menunduk gepeng ---------- */
    const walking = moving && s.grounded
    if (walking) s.phase += dt * speed * 2.8

    player.crouchT = THREE.MathUtils.damp(
      player.crouchT,
      crouch && s.grounded ? 1 : 0,
      14,
      dt,
    )

    /* ---------- Sinkronisasi shared state pemain ---------- */
    player.x = s.x
    player.y = s.y
    player.z = s.z

    /* ---------- Kamera Pengejar Mulus (Smooth Third-Person Follow Camera) ---------- */
    // Kamera berada di belakang & di atas karakter, mengikuti dengan interpolasi lerp
    const targetCamX = s.x * 0.82 + (mouseNorm.current.active ? mouseNorm.current.x * 0.35 : 0)
    const targetCamY = s.y + THREE.MathUtils.lerp(2.2, 1.8, player.crouchT)
    const targetCamZ = s.z + 4.6

    s.camX = THREE.MathUtils.damp(s.camX, targetCamX, 10, dt)
    s.camY = THREE.MathUtils.damp(s.camY, targetCamY, 8, dt)
    s.camZ = THREE.MathUtils.damp(s.camZ, targetCamZ, 12, dt)

    state.camera.position.set(s.camX, s.camY, s.camZ)

    // Titik fokus kamera berada sedikit di depan karakter menyusuri koridor
    const lookAheadX = s.x + (mouseNorm.current.active ? mouseNorm.current.x * 0.8 : 0)
    const lookAheadY = s.y + THREE.MathUtils.lerp(1.15, 0.75, player.crouchT)
    const lookAheadZ = s.z - 14

    _lookTarget.set(lookAheadX, lookAheadY, lookAheadZ)
    state.camera.lookAt(_lookTarget)

    // Posisi 3D group karakter
    if (playerGroup.current) {
      playerGroup.current.position.set(s.x, s.y, s.z)
    }
  })

  return (
    <group ref={playerGroup}>
      <CapsuleCharacter
        color="#0284c7"
        accentColor="#f59e0b"
        crouchT={player.crouchT}
        isJumping={!sim.current.grounded}
        isWalking={true}
        steerTilt={sim.current.steerTilt}
        forwardTilt={0.12}
        runPhase={sim.current.phase}
        shields={shields}
        invulnerable={player.time < player.invulnUntil}
      />
    </group>
  )
}
