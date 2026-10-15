import { useKeyboardControls } from '@react-three/drei'
import { Controls } from '../../config/controls'
import { CHECKPOINTS, RULES, TRACK_LENGTH } from '../../config/track'
import { useGameStore } from '../../store/gameStore'
import { LEVELS_CONFIG } from '../../data/adab'
import { formatTime } from './primitives'
import AdabkuLogo from './AdabkuLogo'

function Chip({ children, className = '' }) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3 py-1.5 font-display text-sm sm:text-base font-extrabold shadow-md ${className}`}
    >
      {children}
    </div>
  )
}

/** Bilah progres lintasan untuk Level 1-4 */
function ProgressBar() {
  const progress = useGameStore((s) => s.progress)
  const checkpointIndex = useGameStore((s) => s.checkpointIndex)
  return (
    <div className="relative mt-2 h-3 w-full rounded-full bg-sky/20">
      <div
        className="h-full rounded-full bg-sky transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
      {CHECKPOINTS.map((z, i) => (
        <span
          key={z}
          className={`absolute top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white text-[10px] font-black shadow ${
            checkpointIndex > i ? 'bg-grass text-white' : 'bg-sun text-ink'
          }`}
          style={{ left: `${(-z / TRACK_LENGTH) * 100}%` }}
        >
          {checkpointIndex > i ? '✓' : '?'}
        </span>
      ))}
      <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-xs">🏁</span>
    </div>
  )
}

/** Bilah HP Sumber Laser untuk Level 5 Arena */
function TowerHpBar() {
  const towerHp = useGameStore((s) => s.towerHp ?? 8)
  const towerMaxHp = useGameStore((s) => s.towerMaxHp ?? 8)
  const pct = towerMaxHp > 0 ? Math.max(0, Math.min(100, (towerHp / towerMaxHp) * 100)) : 0

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs font-bold text-ink-soft mb-1">
        <span>⚡ Daya Sumber Laser</span>
        <span className="text-pink-600 font-extrabold">{towerHp} / {towerMaxHp} HP</span>
      </div>
      <div className="h-3 w-full rounded-full bg-pink-100 overflow-hidden border border-pink-200">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function Key({ action, label, wide = false }) {
  const pressed = useKeyboardControls((state) => (action ? state[action] : false))
  return (
    <kbd
      className={`grid h-8 place-items-center rounded-lg border px-2 font-display text-xs font-bold transition-all duration-75 ${
        wide ? 'min-w-16' : 'min-w-8'
      } ${
        pressed
          ? 'translate-y-0.5 border-sky-dark bg-sky text-white shadow-[0_1px_0_var(--color-sky-dark)]'
          : 'border-slate-200 bg-white text-ink shadow-[0_2px_0_#cbd5e1]'
      }`}
    >
      {label}
    </kbd>
  )
}

/** Panduan tombol keyboard */
function KeyGuide({ isLevel5 }) {
  return (
    <section
      aria-label="Panduan kontrol"
      className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-end gap-4 rounded-2xl border border-white/90 bg-white/95 px-5 py-2.5 shadow-xl pointer-fine:flex"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="grid grid-cols-3 gap-1">
          <span />
          <Key action={Controls.forward} label="W" />
          <span />
          <Key action={Controls.left} label="A" />
          <Key action={Controls.backward} label="S" />
          <Key action={Controls.right} label="D" />
        </div>
        <p className="text-[11px] font-extrabold text-ink-soft">Gerak / Panah</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Key action={Controls.jump} label="Spasi" wide />
        <p className="text-[11px] font-extrabold text-ink-soft">Melompat</p>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Key action={Controls.crouch} label="Shift / C" wide />
        <p className="text-[11px] font-extrabold text-ink-soft">Menunduk</p>
      </div>

      {isLevel5 && (
        <div className="flex flex-col items-center gap-1">
          <kbd className="grid h-8 min-w-20 place-items-center rounded-lg border border-sky-400 bg-sky text-white px-2 font-display text-xs font-bold shadow-[0_2px_0_#0284c7]">
            F / Klik
          </kbd>
          <p className="text-[11px] font-extrabold text-sky-700">Tembak Air</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        <kbd className="grid h-8 min-w-16 place-items-center rounded-lg border border-slate-200 bg-white px-2 font-display text-xs font-bold shadow-[0_2px_0_#cbd5e1]">
          Esc / P
        </kbd>
        <p className="text-[11px] font-extrabold text-ink-soft">Jeda</p>
      </div>
    </section>
  )
}

export default function HUD() {
  const currentLevel = useGameStore((s) => s.currentLevel)
  const gameMode = useGameStore((s) => s.gameMode)
  const roomCode = useGameStore((s) => s.roomCode)
  const connectionStatus = useGameStore((s) => s.connectionStatus)
  const isPointerLocked = useGameStore((s) => s.isPointerLocked)
  const playerName = useGameStore((s) => s.playerName)
  const score = useGameStore((s) => s.score)
  const hearts = useGameStore((s) => s.hearts)
  const shields = useGameStore((s) => s.shields)
  const waterAmmo = useGameStore((s) => s.waterAmmo)
  const elapsed = useGameStore((s) => s.elapsed)
  const isMuted = useGameStore((s) => s.isMuted)
  const togglePause = useGameStore((s) => s.togglePause)
  const toggleSound = useGameStore((s) => s.toggleSound)

  const levelInfo = LEVELS_CONFIG[currentLevel] || LEVELS_CONFIG[1]
  const isLevel5 = currentLevel === 5

  return (
    <div className="pointer-events-none absolute inset-0 z-20 p-2.5 sm:p-4">
      <div className="flex items-start justify-between gap-2.5">
        {/* Header Logo Adabku Bulat (Pojok Kiri Atas) */}
        <header className="pointer-events-auto w-64 rounded-2xl border-2 border-emerald-300 bg-white p-3 shadow-xl sm:w-80">
          <div className="flex items-center gap-2.5">
            <AdabkuLogo size="sm" />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-emerald-800 tracking-tight">
                  Adabku
                </h1>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                  Lv. {currentLevel}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {playerName}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-emerald-600 truncate max-w-[180px] sm:max-w-[220px]">
                {levelInfo.goal}
              </p>
            </div>
          </div>

          {isLevel5 ? <TowerHpBar /> : <ProgressBar />}
        </header>

        {/* Statistik Permainan */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          {gameMode === 'multiplayer' && (
            <Chip
              className={
                connectionStatus === 'connected'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-950 shadow-sm'
                  : connectionStatus === 'waiting'
                  ? 'border-amber-400 bg-amber-50 text-amber-950 shadow-sm'
                  : 'border-sky-400 bg-sky-50 text-sky-950 shadow-sm'
              }
            >
              <span
                className={`inline-block size-2.5 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : connectionStatus === 'waiting'
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-sky-500 animate-pulse'
                }`}
              />
              <span className="text-xs sm:text-sm font-bold">
                {connectionStatus === 'connected'
                  ? `Terhubung dengan Pemain Lain! (${roomCode})`
                  : connectionStatus === 'waiting'
                  ? `Menunggu Pemain... (${roomCode})`
                  : `Menghubungkan... (${roomCode})`}
              </span>
            </Chip>
          )}

          {gameMode === 'single' && !isLevel5 && (
            <Chip className="border-emerald-300 bg-emerald-50/95 text-emerald-950">
              <span>🏃</span>
              <span className="text-xs sm:text-sm font-bold">Single Player</span>
            </Chip>
          )}

          {isLevel5 && (
            <Chip className="border-cyan-300 bg-cyan-50/95 text-cyan-900 shadow-cyan-100">
              <span className="text-lg">💧</span>
              <span className="text-xs sm:text-sm font-bold">
                Pistol Air: <strong className="text-cyan-600 text-base font-extrabold tabular-nums">{waterAmmo}</strong>
              </span>
            </Chip>
          )}

          <Chip>
            <span>⭐</span>
            <span className="tabular-nums font-black">{score}</span>
          </Chip>

          <Chip aria-label={`Nyawa ${hearts}`}>
            {Array.from({ length: RULES.maxHearts }, (_, i) => (
              <span key={i} className={i < hearts ? '' : 'opacity-25 grayscale'}>
                ❤️
              </span>
            ))}
          </Chip>

          <Chip className={shields > 0 ? 'border-sky-400 bg-sky-50 text-sky-900' : ''}>
            <span>🛡️</span>
            <span className="tabular-nums">{shields}</span>
          </Chip>

          <Chip className="hidden md:flex">
            <span>⏱️</span>
            <span className="tabular-nums">{formatTime(elapsed)}</span>
          </Chip>

          {/* Tombol Mute / Suara */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
            className="grid size-10 sm:size-11 place-items-center rounded-2xl bg-white border border-slate-200 text-lg shadow-md transition-all active:translate-y-0.5 hover:bg-slate-50"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Tombol Pause */}
          <button
            id="pause-button"
            type="button"
            onClick={togglePause}
            aria-label="Jeda permainan"
            className="grid size-10 sm:size-11 place-items-center rounded-2xl bg-orange text-lg text-white shadow-[0_4px_0_var(--color-orange-dark)] transition-all active:translate-y-0.5 active:shadow-none"
          >
            ⏸️
          </button>
        </div>
      </div>

      {/* Indikator / Tombol Petunjuk Kontrol 360° Mouse Laptop (Pointer Lock) */}
      <div className="pointer-events-none mt-2 hidden pointer-fine:flex justify-center">
        {!isPointerLocked ? (
          <button
            type="button"
            data-pointerlock="true"
            onClick={() => {
              const canvas = document.querySelector('canvas') || document.getElementById('game-canvas') || document.body
              canvas?.requestPointerLock?.()
            }}
            className="pointer-events-auto group flex items-center gap-2 rounded-full border border-sky-300/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-sky-950 shadow-md backdrop-blur-sm transition-all hover:bg-sky-50 active:scale-95 cursor-pointer"
            aria-label="Aktifkan Kontrol 360 Mouse"
          >
            <span className="grid size-5 place-items-center rounded-full bg-sky-100 text-xs">🖱️</span>
            <span>
              <strong>Klik 2x</strong> pada layar / tombol ini untuk Kontrol 360° Mouse{' '}
              <span className="text-slate-500 font-normal">(Tekan ESC untuk keluar)</span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            data-pointerlock="true"
            onClick={() => {
              document.exitPointerLock?.()
            }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-950/90 px-3.5 py-1.5 text-xs font-bold text-emerald-200 shadow-lg backdrop-blur-sm cursor-pointer hover:bg-emerald-900 transition-colors"
            title="Klik untuk keluar dari kontrol mouse"
          >
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Kontrol 360° Mouse Aktif <span className="text-emerald-400/80 font-normal">(Klik / Tekan ESC untuk keluar)</span>
            </span>
          </button>
        )}
      </div>

      <KeyGuide isLevel5={isLevel5} />
    </div>
  )
}
