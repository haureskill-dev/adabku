import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { PLAYER } from '../../config/controls'
import { BOUNDS, PALETTE } from '../../config/track'
import { player, resetPlayer } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'

/* ------------------------------------------------------------------
 * Proporsi Stickman (satuan meter)
 * Karakter strictly FACELESS: kepala berupa bola polos tanpa detail wajah.
 * ------------------------------------------------------------------ */
const R = 0.065 // ketebalan tungkai
const THIGH = 0.42
const SHIN = 0.42
const HIP_Y = THIGH + SHIN
const TORSO = 0.62
const UPPER_ARM = 0.32
const FOREARM = 0.3
const HEAD_R = 0.22
const SHOULDER_Y = TORSO - 0.06
const CROUCH_DROP = 0.38

const LIMB_COLOR = PALETTE.navy
const BODY_COLOR = PALETTE.orange
const HEAD_COLOR = '#fef3c7'

const _camTarget = new THREE.Vector3()
const _lookTarget = new THREE.Vector3()
const NO_INPUT = { forward: false, backward: false, left: false, right: false, jump: false, crouch: false }

function Limb({ length, color = LIMB_COLOR }) {
  return (
    <mesh position={[0, -length / 2, 0]} castShadow>
      <capsuleGeometry args={[R, Math.max(length - R * 2, 0.01), 10, 16]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
    </mesh>
  )
}

const damp = THREE.MathUtils.damp

function angleDelta(from, to) {
  let d = (to - from) % (Math.PI * 2)
  if (d > Math.PI) d -= Math.PI * 2
  if (d < -Math.PI) d += Math.PI * 2
  return d
}

/** Gelembung Perisai Adab — tampil selama pemain memiliki perisai. */
function ShieldBubble({ shields }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current || shields <= 0) return
    const k = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.04
    ref.current.scale.setScalar(k)
    ref.current.rotation.y = state.clock.elapsedTime * 0.5
  })

  return (
    <mesh ref={ref} position={[0, 1, 0]} visible={shields > 0}>
      <sphereGeometry args={[1.05, 32, 32]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#0284c7"
        emissiveIntensity={0.6}
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Stickman({ shields = 0 }) {
  const [, getKeys] = useKeyboardControls()

  const root = useRef()
  const hips = useRef()
  const torso = useRef()
  const thighL = useRef()
  const thighR = useRef()
  const shinL = useRef()
  const shinR = useRef()
  const armL = useRef()
  const armR = useRef()
  const foreL = useRef()
  const foreR = useRef()

  const sim = useRef({ vy: 0, grounded: true, jumpHeld: false, yaw: Math.PI, phase: 0, stride: 0 })

  useEffect(() => resetPlayer(), [])

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05)
    const s = sim.current
    const store = useGameStore.getState()
    const active = store.phase === 'playing'

    // Gabungkan input keyboard + tombol sentuh (mobile)
    const k = active ? getKeys() : NO_INPUT
    const t = active ? store.touch : NO_INPUT
    const forward = k.forward || t.forward
    const backward = k.backward || t.backward
    const left = k.left || t.left
    const right = k.right || t.right
    const jump = k.jump || t.jump
    const crouch = k.crouch || t.crouch

    const p = root.current.position
    if (active) player.time += dt

    /* ---------- Gerak horizontal di dalam koridor ---------- */
    const dx = Number(right) - Number(left)
    const dz = Number(backward) - Number(forward)
    const moving = dx !== 0 || dz !== 0
    const speed = crouch && s.grounded ? PLAYER.crouchSpeed : PLAYER.walkSpeed

    if (moving) {
      const len = Math.hypot(dx, dz)
      p.x = THREE.MathUtils.clamp(p.x + (dx / len) * speed * dt, BOUNDS.minX, BOUNDS.maxX)
      p.z = THREE.MathUtils.clamp(p.z + (dz / len) * speed * dt, BOUNDS.minZ, BOUNDS.maxZ)
      s.yaw += angleDelta(s.yaw, Math.atan2(dx, dz)) * Math.min(1, PLAYER.turnSpeed * dt)
    }
    root.current.rotation.y = s.yaw

    /* ---------- Lompat & gravitasi ---------- */
    if (jump && !s.jumpHeld && s.grounded) {
      s.vy = PLAYER.jumpVelocity
      s.grounded = false
    }
    s.jumpHeld = jump
    if (!s.grounded) {
      s.vy -= PLAYER.gravity * dt
      p.y += s.vy * dt
      if (p.y <= 0) {
        p.y = 0
        s.vy = 0
        s.grounded = true
      }
    }

    /* ---------- Animasi prosedural ---------- */
    const walking = moving && s.grounded
    s.stride = damp(s.stride, walking ? 1 : 0, 10, dt)
    player.crouchT = damp(player.crouchT, crouch && s.grounded ? 1 : 0, 14, dt)
    if (walking) s.phase += dt * speed * 2.4

    const air = s.grounded ? 0 : 1
    const A = 0.65 * s.stride
    const c = player.crouchT

    // Rotasi X negatif = paha maju
    const legPose = (ph) => ({
      thigh: -Math.sin(ph) * A - c * 1.0 - air * 0.7,
      shin: Math.max(0, -Math.cos(ph)) * 0.9 * s.stride + c * 2.0 + air * 1.1,
    })
    const lp = legPose(s.phase)
    const rp = legPose(s.phase + Math.PI)
    thighL.current.rotation.x = damp(thighL.current.rotation.x, lp.thigh, 18, dt)
    shinL.current.rotation.x = damp(shinL.current.rotation.x, lp.shin, 18, dt)
    thighR.current.rotation.x = damp(thighR.current.rotation.x, rp.thigh, 18, dt)
    shinR.current.rotation.x = damp(shinR.current.rotation.x, rp.shin, 18, dt)

    const armSwing = Math.sin(s.phase) * A * 0.9
    armL.current.rotation.x = damp(armL.current.rotation.x, air ? -2.7 : armSwing - c * 0.9, 14, dt)
    armR.current.rotation.x = damp(armR.current.rotation.x, air ? -2.7 : -armSwing - c * 0.9, 14, dt)
    armL.current.rotation.z = damp(armL.current.rotation.z, air ? 0.5 : 0.18, 14, dt)
    armR.current.rotation.z = damp(armR.current.rotation.z, air ? -0.5 : -0.18, 14, dt)
    const foreBend = -0.25 - s.stride * 0.35 - c * 0.6
    foreL.current.rotation.x = damp(foreL.current.rotation.x, foreBend, 14, dt)
    foreR.current.rotation.x = damp(foreR.current.rotation.x, foreBend, 14, dt)

    const bob = Math.abs(Math.cos(s.phase)) * 0.05 * s.stride
    hips.current.position.y = HIP_Y - CROUCH_DROP * c + bob
    torso.current.rotation.x = damp(torso.current.rotation.x, c * 0.45 + s.stride * 0.08, 12, dt)

    // Berkedip saat kebal setelah terkena laser
    const invuln = player.time < player.invulnUntil
    root.current.visible = !invuln || Math.floor(player.time * 14) % 2 === 0

    /* ---------- Bagikan state pemain ---------- */
    player.x = p.x
    player.y = p.y
    player.z = p.z

    /* ---------- Kamera: di belakang, melihat jauh ke depan koridor ---------- */
    _camTarget.set(p.x * 0.6, 4.2 + p.y * 0.4, p.z + 7.5)
    _lookTarget.set(p.x * 0.8, 1.2 + p.y * 0.5, p.z - 6)
    state.camera.position.lerp(_camTarget, 1 - Math.exp(-5 * dt))
    state.camera.lookAt(_lookTarget)
  })

  return (
    <group ref={root}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} depthWrite={false} />
      </mesh>

      <ShieldBubble shields={shields} />

      <group ref={hips} position={[0, HIP_Y, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[R * 1.6, 20, 20]} />
          <meshStandardMaterial color={LIMB_COLOR} roughness={0.2} metalness={0.1} />
        </mesh>

        {[
          [thighL, shinL, 0.11],
          [thighR, shinR, -0.11],
        ].map(([thigh, shin, x], i) => (
          <group key={i} ref={thigh} position={[x, 0, 0]}>
            <Limb length={THIGH} />
            <group ref={shin} position={[0, -THIGH, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[R * 1.05, 16, 16]} />
                <meshStandardMaterial color={LIMB_COLOR} roughness={0.2} metalness={0.1} />
              </mesh>
              <Limb length={SHIN} />
              <mesh position={[0, -SHIN + 0.02, 0.06]} castShadow>
                <boxGeometry args={[0.13, 0.08, 0.24]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.1} />
              </mesh>
            </group>
          </group>
        ))}

        {/* Badan atas berbentuk kapsul */}
        <group ref={torso}>
          <mesh position={[0, TORSO / 2 + 0.02, 0]} castShadow>
            <capsuleGeometry args={[0.15, TORSO - 0.3, 12, 24]} />
            <meshStandardMaterial color={BODY_COLOR} roughness={0.2} metalness={0.1} />
          </mesh>

          {[
            [armL, foreL, 0.2],
            [armR, foreR, -0.2],
          ].map(([arm, fore, x], i) => (
            <group key={i} ref={arm} position={[x, SHOULDER_Y, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[R * 1.2, 16, 16]} />
                <meshStandardMaterial color={BODY_COLOR} roughness={0.2} metalness={0.1} />
              </mesh>
              <Limb length={UPPER_ARM} />
              <group ref={fore} position={[0, -UPPER_ARM, 0]}>
                <Limb length={FOREARM} />
                <mesh position={[0, -FOREARM, 0]} castShadow>
                  <sphereGeometry args={[R * 1.35, 16, 16]} />
                  <meshStandardMaterial color={HEAD_COLOR} roughness={0.2} metalness={0.1} />
                </mesh>
              </group>
            </group>
          ))}

          {/* Kepala: bola polos (faceless) */}
          <mesh position={[0, TORSO + 0.06 + HEAD_R, 0]} castShadow>
            <sphereGeometry args={[HEAD_R, 32, 32]} />
            <meshStandardMaterial color={HEAD_COLOR} roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
