import { CHECKPOINTS, RULES } from '../../config/track'
import { LEVELS_CONFIG } from '../../data/adab'
import { useGameStore } from '../../store/gameStore'
import { BigButton, Overlay, formatTime } from './primitives'
import AdabkuLogo from './AdabkuLogo'

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-slate-100">
      <div className="text-xl sm:text-2xl">{icon}</div>
      <div className="font-display text-xl sm:text-2xl font-extrabold tabular-nums text-ink">{value}</div>
      <div className="text-[11px] font-extrabold text-ink-soft">{label}</div>
    </div>
  )
}

/** Layar rekap akhir level & hasil permainan untuk 5 Level Adab */
export default function RecapScreen() {
  const s = useGameStore()
  const success = s.result === 'selesai'
  const isBest = s.best && s.best.score === s.score && s.score > 0
  const currentLevel = s.currentLevel
  const gameMode = s.gameMode
  const playerName = s.playerName || 'Ahmad'
  const levelInfo = LEVELS_CONFIG[currentLevel] || LEVELS_CONFIG[1]

  const hasNextLevel = currentLevel < 5 && success

  const goalIcons = {
    1: '🕌',
    2: '🏫',
    3: '🏡',
    4: '🌿',
    5: '🎯',
  }

  const getSuccessMessage = () => {
    switch (currentLevel) {
      case 1:
        return 'Alhamdulillah, kamu sampai di Masjid!'
      case 2:
        return 'Alhamdulillah, kamu sampai di Rumah dengan adab mulia!'
      case 3:
        return 'Masya Allah, kamu tiba di Sekolah dengan selamat!'
      case 4:
        return 'Masya Allah, kamu tiba di Hutan Asri dengan menjaga kelestarian alam!'
      case 5:
        return 'Mubarak! Sumber Laser Berhasil Dipadamkan!'
      default:
        return 'Alhamdulillah, misi berhasil diselesaikan!'
    }
  }

  return (
    <Overlay labelledBy="recap-title" transparentBackdrop={true} className="text-center max-w-lg border-3 border-emerald-400 bg-white shadow-2xl p-5 sm:p-7">
      {/* Header Logo Adabku Bulat Konsisten */}
      <div className="mb-3 flex items-center justify-center gap-2 border-b-2 border-slate-100 pb-2.5">
        <AdabkuLogo size="xs" />
        <span className="font-display text-base font-extrabold text-emerald-800">
          Adabku — Hasil Permainan
        </span>
      </div>

      <div className="text-5xl sm:text-6xl">{success ? goalIcons[currentLevel] || '🌱' : '🌱'}</div>

      <h2 id="recap-title" className="mt-2 font-display text-2xl sm:text-3xl leading-tight font-extrabold text-ink">
        {success ? getSuccessMessage() : 'Yuk, coba lagi!'}
      </h2>

      <p className="mt-1 text-xs sm:text-sm font-bold text-ink-soft">
        {success
          ? currentLevel === 5
            ? `Selamat ${playerName}! Daya sumber laser telah padam sepenuhnya berkat tembakan pistol air dan keteguhan adabmu.`
            : `Hebat ${playerName}! Kamu berhasil menyelesaikan tantangan adab ${levelInfo.name}.`
          : 'Perisai dan nyawamu habis. Tetap semangat mengamalkan adab baik!'}
      </p>

      {/* Kartu Skor & Peringkat */}
      <div className="mt-4 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-300 p-4 shadow-[0_5px_0_#d97706]">
        <div className="text-xs font-black uppercase text-amber-950/70">TOTAL SKOR ADAB</div>
        <div className="font-display text-4xl sm:text-5xl font-extrabold tabular-nums text-amber-950">
          {s.score}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-xs font-black text-amber-950">
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm">
            🏷️ {playerName}
          </span>
          {currentLevel < 5 ? (
            gameMode === 'multiplayer' ? (
              <span className="rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm">
                🏆 Juara {s.rank} dari {s.totalRacers} Pelari
              </span>
            ) : (
              <span className="rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm">
                🏃 Mode Single Player
              </span>
            )
          ) : (
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 shadow-sm">
              💧 Tembakan Air: {s.waterHits} Kali
            </span>
          )}
        </div>

        {isBest && <div className="mt-1 text-xs font-extrabold text-emerald-900">✨ Rekor baru!</div>}
      </div>

      {/* Grid Statistik */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat icon="⏱️" label="Waktu Tempuh" value={formatTime(s.elapsed)} />
        <Stat icon="⚡" label="Laser Dihindari" value={s.dodged} />
        <Stat
          icon="📝"
          label={currentLevel === 5 ? 'Butiran Selesai' : 'Kuis Benar'}
          value={currentLevel === 5 ? `${s.collectedOrbs.length}/6` : `${s.quizCorrect}/${CHECKPOINTS.length}`}
        />
        <Stat icon="❤️" label="Nyawa Sisa" value={`${s.hearts}/${RULES.maxHearts}`} />
      </div>

      {/* Banner Level Terbuka */}
      {hasNextLevel && (
        <div className="mt-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-2.5 text-center shadow-sm">
          <div className="text-xs font-black text-emerald-800">
            🔓 ALHAMDULILLAH! LEVEL {currentLevel + 1} TELAH TERBUKA!
          </div>
          <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
            Progresmu tersimpan otomatis. Kamu bisa lanjut sekarang atau memilihnya di menu utama.
          </p>
        </div>
      )}

      {/* Tombol Lanjut / Ulang */}
      <div className="mt-4 space-y-2">
        {hasNextLevel && (
          <BigButton
            id="next-level-button"
            variant="green"
            className="w-full text-lg shadow-emerald-700/30 py-3"
            onClick={s.nextLevel}
            autoFocus
          >
            Lanjut ke Level {currentLevel + 1} ▶
          </BigButton>
        )}

        <BigButton
          id="play-again-button"
          variant={hasNextLevel ? 'sky' : 'green'}
          className="w-full text-base"
          onClick={() => s.startGame(currentLevel)}
          autoFocus={!hasNextLevel}
        >
          ↺ {success && !hasNextLevel ? 'Mainkan Ulang Dari Awal' : 'Ulangi Level Ini'}
        </BigButton>
      </div>
    </Overlay>
  )
}
