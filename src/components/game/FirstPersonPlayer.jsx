import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { PLAYER } from '../../config/controls'
import { BOUNDS } from '../../config/track'
import { player, resetPlayer } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'

/* ------------------------------------------------------------------
 * First-Person POV Controller (Bebas Halangan / Bebas Layar Hijau)
 * - Kamera berada tepat di posisi mata pemain sendiri menyusuri lintasan.
 * - Tanpa meletakkan objek billboard / name tag di depan lensa kamera pemain.
 * - Berjalan di koridor lurus (Level 1-4) atau Arena Terbuka (Level 5).
 * - Pandangan bersih, lurus menyusuri lintasan masjid.
 * ------------------------------------------------------------------ */
const STAND_EYE_Y = 1.6
const CROUCH_EYE_Y = 0.95
const DEFAULT_PITCH = 0 // Tepat sejajar lantai (tidak mendongak/dangak)

const _lookTarget = new THREE.Vector3()
const NO_INPUT = { forward: false, backward: false, left: false, right: false, jump: false, crouch: false }

export default function FirstPersonPlayer({ shields = 0 }) {
  const [, getKeys] = useKeyboardControls()
  const { gl } = useThree()
  const canvasRef = useRef(null)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const isLevel5 = currentLevel === 5

  // Sudut pandang kamera (yaw & pitch)
  const look = useRef({
    yaw: 0,
    pitch: DEFAULT_PITCH,
    isMouseDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    isTouchDragging: false,
    lastTouchX: 0,
    lastTouchY: 0,
  })

  const sim = useRef({
    x: 0,
    y: 0,
    z: isLevel5 ? 18 : 0,
    vy: 0,
    grounded: true,
    jumpHeld: false,
    stride: 0,
    phase: 0,
  })

  useEffect(() => {
    canvasRef.current = gl?.domElement || document.querySelector('canvas')
    resetPlayer()
    if (isLevel5) {
      sim.current.x = 0
      sim.current.z = 18
      player.x = 0
      player.z = 18
    } else {
      sim.current.x = 0
      sim.current.z = 0
      player.x = 0
      player.z = 0
    }

    // 1. Double Click (Klik 2x) untuk mengaktifkan Pointer Lock di Laptop/Desktop
    const handleDoubleClick = (e) => {
      if (
        e?.target?.closest &&
        e.target.closest('button, input, select, textarea, [role="button"], a, .pointer-events-auto, [data-no-drag]')
      ) {
        return
      }
      if (document.pointerLockElement !== canvasRef.current) {
        canvasRef.current?.requestPointerLock?.()
      }
    }

    // 2. Pergerakan Mouse Laptop: Pointer Lock (movementX/Y) & Fallback Mouse Drag
    const onMouseMove = (e) => {
      const isLocked = Boolean(
        document.pointerLockElement && document.pointerLockElement === canvasRef.current,
      )

      if (isLocked) {
        const mx = e.movementX ?? e.mozMovementX ?? e.webkitMovementX ?? 0
        const my = e.movementY ?? e.mozMovementY ?? e.webkitMovementY ?? 0

        const sensitivity = 0.0024
        look.current.yaw -= mx * sensitivity
        look.current.pitch = THREE.MathUtils.clamp(
          look.current.pitch - my * sensitivity,
          DEFAULT_PITCH - 0.75,
          DEFAULT_PITCH + 0.75,
        )
      } else if (look.current.isMouseDragging) {
        const dx = e.clientX - look.current.lastMouseX
        const dy = e.clientY - look.current.lastMouseY
        look.current.lastMouseX = e.clientX
        look.current.lastMouseY = e.clientY

        const sensitivity = 0.0035
        look.current.yaw -= dx * sensitivity
        look.current.pitch = THREE.MathUtils.clamp(
          look.current.pitch - dy * sensitivity,
          DEFAULT_PITCH - 0.75,
          DEFAULT_PITCH + 0.75,
        )
      }
    }

    const onMouseDown = (e) => {
      if (e.button !== 0) return
      if (document.pointerLockElement === canvasRef.current) return
      if (
        e.target?.closest &&
        e.target.closest('button, input, select, textarea, [role="button"], a, .pointer-events-auto, [data-no-drag]')
      ) {
        return
      }
      look.current.isMouseDragging = true
      look.current.lastMouseX = e.clientX
      look.current.lastMouseY = e.clientY
    }

    const onMouseUp = () => {
      look.current.isMouseDragging = false
    }

    // 3. Touch Drag 360° di Layar HP/Tablet (tanpa memerlukan Pointer Lock)
    const touchLookId = { current: null }

    const onTouchStart = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        const target = document.elementFromPoint(t.clientX, t.clientY)
        if (
          target?.closest &&
          target.closest('button, input, select, textarea, [role="button"], a, .pointer-events-auto, [data-no-drag]')
        ) {
          continue
        }
        if (touchLookId.current === null) {
          touchLookId.current = t.identifier
          look.current.isTouchDragging = true
          look.current.lastTouchX = t.clientX
          look.current.lastTouchY = t.clientY
          break
        }
      }
    }

    const onTouchMove = (e) => {
      if (touchLookId.current === null) return
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]
        if (t.identifier === touchLookId.current) {
          const dx = t.clientX - look.current.lastTouchX
          const dy = t.clientY - look.current.lastTouchY
          look.current.lastTouchX = t.clientX
          look.current.lastTouchY = t.clientY

          const touchSensitivity = 0.0052
          look.current.yaw -= dx * touchSensitivity
          look.current.pitch = THREE.MathUtils.clamp(
            look.current.pitch - dy * touchSensitivity,
            DEFAULT_PITCH - 0.75,
            DEFAULT_PITCH + 0.75,
          )

          if (e.cancelable) {
            e.preventDefault()
          }
          break
        }
      }
    }

    const onTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchLookId.current) {
          touchLookId.current = null
          look.current.isTouchDragging = false
          break
        }
      }
    }

    // 4. Update status pointer lock
    const onPointerLockChange = () => {
      const isLocked = Boolean(
        document.pointerLockElement && document.pointerLockElement === canvasRef.current,
      )
      useGameStore.getState().setPointerLocked(isLocked)
    }

    // Tombol 'F' keyboard untuk menembak air di Level 5
    const onKeyDown = (e) => {
      if ((e.key === 'f' || e.key === 'F') && isLevel5) {
        useGameStore.getState().shootWater()
      }
    }

    const canvas = gl?.domElement
    if (canvas) {
      canvas.addEventListener('dblclick', handleDoubleClick)
    }
    window.addEventListener('dblclick', handleDoubleClick)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    document.addEventListener('pointerlockchange', onPointerLockChange)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      if (canvas) {
        canvas.removeEventListener('dblclick', handleDoubleClick)
      }
      window.removeEventListener('dblclick', handleDoubleClick)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      window.removeEventListener('keydown', onKeyDown)

      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock?.()
      }
      useGameStore.getState().setPointerLocked(false)
    }
  }, [isLevel5, gl])

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05)
    const s = sim.current
    const l = look.current
    const store = useGameStore.getState()
    const active = store.phase === 'playing'

    // Gabungkan input
    const k = active && typeof getKeys === 'function' ? getKeys() : NO_INPUT
    const t = active ? store.touch : NO_INPUT
    const joy = active ? store.joystick : { x: 0, y: 0, active: false }

    let dx = Number(k?.right || t?.right) - Number(k?.left || t?.left)
    let dz = Number(k?.backward || t?.backward) - Number(k?.forward || t?.forward)

    if (joy?.active) {
      dx += joy.x
      dz += joy.y
    }

    const jump = active && (k?.jump || t?.jump)
    const crouch = active && (k?.crouch || t?.crouch)

    if (active) player.time += dt

    /* ---------- Gerak horizontal 360° SELALU searah pandangan kamera ---------- */
    const len = Math.hypot(dx, dz)
    const moving = len > 0.02
    const speed = crouch && s.grounded ? PLAYER.crouchSpeed : PLAYER.walkSpeed

    if (moving) {
      // Vektor pandangan kamera 360° (Forward & Right)
      const fwdX = Math.sin(l.yaw)
      const fwdZ = -Math.cos(l.yaw)
      const rightX = -fwdZ // 90° tegak lurus ke kanan
      const rightZ = fwdX

      // dz < 0: Maju (W / joystick atas), dz > 0: Mundur (S / joystick bawah)
      // dx > 0: Kanan (D / joystick kanan), dx < 0: Kiri (A / joystick kiri)
      const inputFwd = -dz
      const inputRight = dx

      const moveWorldX = fwdX * inputFwd + rightX * inputRight
      const moveWorldZ = fwdZ * inputFwd + rightZ * inputRight
      const mLen = Math.hypot(moveWorldX, moveWorldZ)

      if (mLen > 0.01) {
        const normX = moveWorldX / mLen
        const normZ = moveWorldZ / mLen

        if (isLevel5) {
          // Level 5: Arena Terbuka dengan Pembatas Tak Terlihat (Invisible Walls)
          let nextX = s.x + normX * speed * dt
          let nextZ = s.z + normZ * speed * dt

          const distToCenter = Math.hypot(nextX, nextZ)
          const ARENA_RADIUS = 23.8 // Dinding pembatas luar arena
          if (distToCenter > ARENA_RADIUS) {
            nextX = (nextX / distToCenter) * ARENA_RADIUS
            nextZ = (nextZ / distToCenter) * ARENA_RADIUS
          }

          const TOWER_RADIUS = 3.8 // Pembatas menara laser pusat
          if (distToCenter < TOWER_RADIUS) {
            nextX = (nextX / distToCenter) * TOWER_RADIUS
            nextZ = (nextZ / distToCenter) * TOWER_RADIUS
          }

          s.x = nextX
          s.z = nextZ
        } else {
          // Level 1-4: Koridor Lurus Bersih (Clamped to corridor bounds)
          s.x = THREE.MathUtils.clamp(s.x + normX * speed * dt, BOUNDS.minX, BOUNDS.maxX)
          s.z = THREE.MathUtils.clamp(s.z + normZ * speed * dt, BOUNDS.minZ, BOUNDS.maxZ)
        }
      }
    }

    /* ---------- Lompat & Gravitasi ---------- */
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

    /* ---------- Animasi langkah & Menunduk ---------- */
    const walking = moving && s.grounded
    s.stride = THREE.MathUtils.damp(s.stride, walking ? 1 : 0, 10, dt)
    if (walking) s.phase += dt * speed * 2.8

    player.crouchT = THREE.MathUtils.damp(
      player.crouchT,
      crouch && s.grounded ? 1 : 0,
      14,
      dt,
    )

    const currentEyeY = THREE.MathUtils.lerp(STAND_EYE_Y, CROUCH_EYE_Y, player.crouchT)
    const headBob = Math.sin(s.phase) * 0.005 * s.stride

    /* ---------- Update shared player state ---------- */
    player.x = s.x
    player.y = s.y
    player.z = s.z
    player.yaw = l.yaw

    /* ---------- Kamera POV Orang Pertama ---------- */
    const targetCamY = s.y + currentEyeY + headBob
    s.smoothCamY = THREE.MathUtils.damp(s.smoothCamY ?? targetCamY, targetCamY, 14, dt)
    state.camera.position.set(s.x, s.smoothCamY, s.z)

    const isLocked = Boolean(
      document.pointerLockElement && document.pointerLockElement === canvasRef.current,
    )
    const isInteracting = isLocked || l.isMouseDragging || l.isTouchDragging
    if (!isInteracting) {
      // Jaga kemiringan pitch kamera tetap stabil sejajar lantai secara halus saat tidak sedang mengarahkan
      l.pitch = THREE.MathUtils.damp(l.pitch, DEFAULT_PITCH, 4, dt)
    }

    const forwardDist = 20
    const lookX = s.x + Math.sin(l.yaw) * forwardDist
    const lookY = s.smoothCamY + Math.tan(l.pitch) * forwardDist
    const lookZ = s.z - Math.cos(l.yaw) * forwardDist

    _lookTarget.set(lookX, lookY, lookZ)
    state.camera.lookAt(_lookTarget)
  })

  // Tampilkan cincin perisai melayang di bawah garis pandang saat perisai aktif
  return shields > 0 ? (
    <group position={[player?.x ?? 0, (player?.y ?? 0) + 0.7, (player?.z ?? 0) - 0.5]}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.75, 0.02, 16, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  ) : null
}
