import { useGameStore } from '../../store/gameStore'
import { BigButton, Overlay } from './primitives'
import AdabkuLogo from './AdabkuLogo'

/** Layar jeda dengan pesan pengingat adab dan logo Adabku bulat konsisten. */
export default function PauseOverlay() {
  const togglePause = useGameStore((s) => s.togglePause)
  const startGame = useGameStore((s) => s.startGame)

  return (
    <Overlay labelledBy="pause-title" transparentBackdrop={true} className="text-center max-w-md border-3 border-emerald-400 bg-white shadow-2xl p-6 sm:p-7">
      {/* Header Logo Adabku Bulat */}
      <div className="flex flex-col items-center justify-center gap-2 mb-3">
        <AdabkuLogo size="lg" className="shadow-lg border-3 border-emerald-400" />
        <span className="font-display text-xl font-extrabold text-emerald-800 tracking-tight">
          Adabku
        </span>
      </div>

      <h2 id="pause-title" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
        Permainan Dijeda
      </h2>

      <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/90 p-4 shadow-sm">
        <p className="font-display text-base sm:text-lg leading-snug font-bold text-emerald-900">
          "Dahulukan panggilan orang tua dan waktu shalat! Yuk terapkan adab dalam kehidupan nyata"
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <BigButton id="resume-button" variant="green" onClick={togglePause} autoFocus className="py-3.5 text-base sm:text-lg">
          ▶ Lanjut Main
        </BigButton>
        <BigButton id="restart-button" variant="white" onClick={startGame} className="py-3.5 text-base sm:text-lg border-2 border-slate-200">
          ↺ Ulangi
        </BigButton>
      </div>

      <p className="mt-4 text-xs font-bold text-slate-500">Tekan Esc atau tombol P untuk melanjutkan</p>
    </Overlay>
  )
}
