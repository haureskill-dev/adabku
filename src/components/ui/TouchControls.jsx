import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

/**
 * Virtual Joystick UI untuk HP / Tablet (Mobile) & Layar Sentuh.
 * Mengendalikan arah gerakan maju, mundur, dan belok secara fleksibel dan mulus.
 */
function VirtualJoystick() {
  const setJoystick = useGameStore((s) => s.setJoystick)
  const baseRef = useRef(null)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const activePointerId = useRef(null)
  const baseCenter = useRef({ x: 0, y: 0 })

  const MAX_RADIUS = 46

  const handlePointerDown = (e) => {
    e.preventDefault()
    if (activePointerId.current !== null) return
    activePointerId.current = e.pointerId
    e.currentTarget.setPointerCapture?.(e.pointerId)

    const rect = baseRef.current.getBoundingClientRect()
    baseCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    updateJoystick(e.clientX, e.clientY)
  }

  const updateJoystick = (clientX, clientY) => {
    const rawDx = clientX - baseCenter.current.x
    const rawDy = clientY - baseCenter.current.y
    const dist = Math.hypot(rawDx, rawDy)

    const angle = Math.atan2(rawDy, rawDx)
    const clampedDist = Math.min(dist, MAX_RADIUS)

    const clampedX = Math.cos(angle) * clampedDist
    const clampedY = Math.sin(angle) * clampedDist

    setKnobPos({ x: clampedX, y: clampedY })

    // Normalisasi -1 s/d 1
    const normX = clampedX / MAX_RADIUS
    const normY = clampedY / MAX_RADIUS
    setJoystick(normX, normY, true)
  }

  const handlePointerMove = (e) => {
    if (activePointerId.current !== e.pointerId) return
    e.preventDefault()
    updateJoystick(e.clientX, e.clientY)
  }

  const handlePointerEnd = (e) => {
    if (activePointerId.current !== e.pointerId) return
    activePointerId.current = null
    setKnobPos({ x: 0, y: 0 })
    setJoystick(0, 0, false)
  }

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className="relative size-32 touch-none select-none rounded-full border-2 border-white/80 bg-white/40 p-2 shadow-2xl active:border-sky-300"
      aria-label="Virtual Joystick Kemudi"
    >
      {/* Indikator Arah */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-black text-white/50">
        <span>◀</span>
        <span>▶</span>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-between py-2 text-[10px] font-black text-white/50">
        <span>▲</span>
        <span>▼</span>
      </div>

      {/* Gagang Joystick */}
      <div
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: activePointerId.current === null ? 'transform 0.15s ease-out' : 'none',
        }}
        className="absolute top-1/2 left-1/2 -ml-7 -mt-7 size-14 rounded-full border-2 border-white bg-gradient-to-tr from-sky-500 to-sky-300 shadow-xl flex items-center justify-center text-white text-base font-bold"
      >
        🕹️
      </div>
    </div>
  )
}

/** Tombol Aksi Sentuh */
function ActionButton({ action, label, subLabel, className = '', ariaLabel, onClick }) {
  const setTouch = useGameStore((s) => s.setTouch)
  const pressed = useGameStore((s) => (action ? s.touch[action] : false))

  const press = (val) => (e) => {
    e.preventDefault()
    if (action) setTouch(action, val)
    if (val && onClick) onClick()
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId)
        press(true)(e)
      }}
      onPointerUp={press(false)}
      onPointerCancel={press(false)}
      onLostPointerCapture={press(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`touch-none select-none rounded-2xl border-2 border-white font-display text-white shadow-xl transition-all active:scale-95 ${
        pressed ? 'scale-95 brightness-110' : ''
      } ${className}`}
    >
      <div className="text-base sm:text-lg font-black">{label}</div>
      <div className="text-[9px] sm:text-[10px] font-bold opacity-80">{subLabel}</div>
    </button>
  )
}

/** Kontrol Layar Sentuh Lengkap: Virtual Joystick + Tombol Aksi */
export default function TouchControls() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const waterAmmo = useGameStore((s) => s.waterAmmo)
  const shootWater = useGameStore((s) => s.shootWater)
  const [isMobile, setIsMobile] = useState(false)

  const isLevel5 = currentLevel === 5

  useEffect(() => {
    const check = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth <= 1024
      setIsMobile(hasTouch)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-end justify-between px-4 sm:px-5">
      {/* Sisi Kiri: Virtual Joystick */}
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        <VirtualJoystick />
        <span className="text-[10px] font-extrabold text-white drop-shadow-md">
          Kemudi
        </span>
      </div>

      {/* Sisi Kanan: Tombol Aksi */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {/* Tombol Tembak Air Khusus Level 5 */}
        {isLevel5 && (
          <ActionButton
            action="shoot"
            label={`💦 TEMBAK (${waterAmmo})`}
            subLabel="Pistol Air ke Tower"
            ariaLabel="Tembak pistol air"
            onClick={shootWater}
            className="h-14 w-32 sm:w-36 bg-cyan-600 shadow-cyan-800/50 border-cyan-200"
          />
        )}

        <ActionButton
          action="jump"
          label="⬆ LOMPAT"
          subLabel="Hindari Laser Rendah"
          ariaLabel="Lompat melintasi laser"
          className="h-13 w-32 sm:w-36 bg-emerald-500/90 shadow-emerald-700/40"
        />

        <ActionButton
          action="crouch"
          label="⬇ MENUNDUK"
          subLabel="Hindari Laser Tinggi"
          ariaLabel="Menunduk melintasi laser"
          className="h-12 w-32 sm:w-36 bg-amber-500/90 shadow-amber-700/40"
        />
      </div>
    </div>
  )
}
