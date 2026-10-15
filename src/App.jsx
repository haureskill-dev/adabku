import { KeyboardControls } from '@react-three/drei'
import { keyboardMap } from './config/controls'
import GameCanvas from './components/game/GameCanvas'
import HUD from './components/ui/HUD'
import PauseOverlay from './components/ui/PauseOverlay'
import QuizModal from './components/ui/QuizModal'
import Puzzle3x3Modal from './components/ui/Puzzle3x3Modal'
import RecapScreen from './components/ui/RecapScreen'
import StartScreen from './components/ui/StartScreen'
import Toast from './components/ui/Toast'
import TouchControls from './components/ui/TouchControls'
import { useGameHotkeys } from './hooks/useGameHotkeys'
import { useGameStore } from './store/gameStore'

export default function App() {
  const phase = useGameStore((s) => s.phase)
  useGameHotkeys()

  const inGame = phase === 'playing' || phase === 'paused' || phase === 'quiz' || phase === 'puzzle'

  return (
    <KeyboardControls map={keyboardMap}>
      <main className="relative h-full w-full">
        {/* Lapisan 3D */}
        <GameCanvas />

        {/* Lapisan UI (Tailwind) */}
        {inGame && <HUD />}
        {phase === 'playing' && <TouchControls />}
        <Toast />

        {phase === 'start' && <StartScreen />}
        {phase === 'paused' && <PauseOverlay />}
        {phase === 'quiz' && <QuizModal />}
        {phase === 'puzzle' && <Puzzle3x3Modal />}
        {phase === 'finished' && <RecapScreen />}
      </main>
    </KeyboardControls>
  )
}
