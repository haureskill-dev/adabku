import { useState, useMemo, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { sound } from '../../utils/audio'
import FacelessIllustration from './FacelessIllustrations'
import AdabkuLogo from './AdabkuLogo'

// Fungsi shuffle sederhana tapi tidak langsung tersusun
function shufflePuzzleTiles() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // Pastikan tidak langsung tersusun dari awal
  if (arr.every((val, idx) => val === idx)) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  return arr
}

export default function Puzzle3x3Modal() {
  const activeOrb = useGameStore((s) => s.activeOrb)
  const activePuzzle = useGameStore((s) => s.activePuzzle)
  const solvePuzzleAssembly = useGameStore((s) => s.solvePuzzleAssembly)
  const answerPuzzleQuiz = useGameStore((s) => s.answerPuzzleQuiz)
  const closeLevel4Orb = useGameStore((s) => s.closeLevel4Orb)

  // State keping puzzle 3x3
  const [tiles, setTiles] = useState(() => shufflePuzzleTiles())
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [draggingIdx, setDraggingIdx] = useState(null)

  const boardRef = useRef(null)

  const isAssembled = useMemo(() => {
    return tiles.every((val, idx) => val === idx)
  }, [tiles])

  if (!activeOrb || !activePuzzle) return null

  // Tukar posisi dua keping puzzle
  const swapTiles = (indexA, indexB) => {
    if (indexA === indexB || indexA === null || indexB === null) return
    sound.playPuzzleMove()

    const newTiles = [...tiles]
    const temp = newTiles[indexA]
    newTiles[indexA] = newTiles[indexB]
    newTiles[indexB] = temp
    setTiles(newTiles)
    setSelectedIdx(null)
    setHoveredIdx(null)
    setDraggingIdx(null)

    // Cek apakah sudah tersusun lengkap
    if (newTiles.every((val, idx) => val === idx)) {
      setTimeout(() => {
        solvePuzzleAssembly()
      }, 500)
    }
  }

  // 1. Dukungan Tap / Klik Biasa (Aksesibilitas Cepat)
  const handleTileClick = (index) => {
    if (activePuzzle.assembled || isAssembled) return

    if (selectedIdx === null) {
      sound.playPuzzleMove()
      setSelectedIdx(index)
    } else {
      swapTiles(selectedIdx, index)
    }
  }

  // 2. Dukungan Drag & Drop HTML5 (Laptop / Desktop Mouse)
  const handleDragStart = (e, index) => {
    if (activePuzzle.assembled || isAssembled) return
    setDraggingIdx(index)
    e.dataTransfer.setData('text/plain', String(index))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (hoveredIdx !== index) {
      setHoveredIdx(index)
    }
  }

  const handleDrop = (e, targetIndex) => {
    e.preventDefault()
    const sourceIndex = draggingIdx !== null ? draggingIdx : parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(sourceIndex)) {
      swapTiles(sourceIndex, targetIndex)
    }
    setDraggingIdx(null)
    setHoveredIdx(null)
  }

  // 3. Dukungan Pointer Events / Touch Drag & Drop (Layar HP / Tablet)
  const handlePointerDown = (e, index) => {
    if (activePuzzle.assembled || isAssembled) return
    // Tangkap touch drag
    if (e.pointerType === 'touch') {
      setDraggingIdx(index)
      setSelectedIdx(index)
    }
  }

  const handlePointerUp = (e) => {
    if (draggingIdx === null) return

    // Temukan elemen tombol target di bawah titik sentuhan jari
    const touchElem = document.elementFromPoint(e.clientX, e.clientY)
    const buttonTarget = touchElem?.closest('[data-puzzle-idx]')
    if (buttonTarget) {
      const targetIndex = parseInt(buttonTarget.getAttribute('data-puzzle-idx'), 10)
      if (!isNaN(targetIndex) && targetIndex !== draggingIdx) {
        swapTiles(draggingIdx, targetIndex)
        return
      }
    }

    setDraggingIdx(null)
    setHoveredIdx(null)
  }

  return (
    <div
      className="absolute inset-0 z-40 grid place-items-center bg-slate-900/40 p-3 animate-fade-in touch-none select-none"
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setDraggingIdx(null)
        setHoveredIdx(null)
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl border-3 border-emerald-400 bg-white p-5 shadow-2xl">
        {/* Header Kuis Puzzle & Logo Adabku Bulat */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <AdabkuLogo size="xs" />
            <span className="font-display text-sm font-black text-emerald-800">
              Adabku
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-800">
              🧩 Puzzle Adab 3x3
            </span>
          </div>
          <h2 className="mt-1 font-display text-lg sm:text-xl font-black text-slate-900">
            {activeOrb.title}
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            {activePuzzle.step === 'assemble'
              ? 'Geser (drag & drop) atau ketuk dua keping untuk menukar posisinya!'
              : 'Puzzle berhasil disusun! Jawab pertanyaan adab berikut:'}
          </p>
        </div>

        {/* TAHAP 1: SUSUN PUZZLE 3x3 */}
        {activePuzzle.step === 'assemble' && (
          <div className="mx-auto w-64 sm:w-72">
            <div
              ref={boardRef}
              className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-slate-100 border-2 border-slate-200 shadow-inner"
            >
              {tiles.map((tileTarget, currentPos) => {
                const isSelected = selectedIdx === currentPos
                const isHovered = hoveredIdx === currentPos
                const isDragging = draggingIdx === currentPos
                const isCorrectPos = tileTarget === currentPos

                const row = Math.floor(tileTarget / 3)
                const col = tileTarget % 3

                return (
                  <button
                    key={currentPos}
                    type="button"
                    data-puzzle-idx={currentPos}
                    draggable
                    onDragStart={(e) => handleDragStart(e, currentPos)}
                    onDragOver={(e) => handleDragOver(e, currentPos)}
                    onDragLeave={() => setHoveredIdx(null)}
                    onDrop={(e) => handleDrop(e, currentPos)}
                    onPointerDown={(e) => handlePointerDown(e, currentPos)}
                    onClick={() => handleTileClick(currentPos)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                      isDragging
                        ? 'opacity-40 scale-95 border-dashed border-sky-500'
                        : isHovered
                        ? 'border-sky-400 bg-sky-100 scale-105 shadow-xl ring-4 ring-sky-300 z-20'
                        : isSelected
                        ? 'border-emerald-500 scale-105 shadow-lg ring-4 ring-emerald-300 z-10'
                        : isCorrectPos
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-300 bg-white shadow-sm hover:border-sky-400'
                    }`}
                  >
                    {/* Render visual slice gambar faceless */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        width: '300%',
                        height: '300%',
                        left: `${-col * 100}%`,
                        top: `${-row * 100}%`,
                      }}
                    >
                      <FacelessIllustration type={activeOrb.puzzleImage} className="w-full h-full" />
                    </div>

                    {/* Penanda angka keping di sudut */}
                    <span
                      className={`absolute bottom-1 right-1 grid size-5 place-items-center rounded-md text-[10px] font-black shadow-sm pointer-events-none ${
                        isCorrectPos ? 'bg-emerald-600 text-white' : 'bg-slate-800/70 text-white'
                      }`}
                    >
                      {tileTarget + 1}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Bantuan / Info Progres */}
            <div className="mt-3 flex justify-between items-center text-xs text-ink-soft">
              <span className="font-bold">
                {tiles.filter((v, i) => v === i).length} / 9 Posisi Tepat
              </span>
              <button
                type="button"
                onClick={() => {
                  setTiles([0, 1, 2, 3, 4, 5, 6, 7, 8])
                  setTimeout(solvePuzzleAssembly, 300)
                }}
                className="text-emerald-600 font-extrabold hover:underline"
              >
                Susun Otomatis ✨
              </button>
            </div>
          </div>
        )}

        {/* TAHAP 2: PERTANYAAN ADAB SETELAH PUZZLE TERBENTUK */}
        {activePuzzle.step !== 'assemble' && (
          <div className="space-y-3">
            {/* Gambar Utuh yang Berhasil Disusun */}
            <div className="mx-auto w-52 sm:w-60 overflow-hidden rounded-2xl border-2 border-emerald-400 shadow-md">
              <FacelessIllustration type={activeOrb.puzzleImage} className="w-full h-44" />
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-center border border-emerald-200">
              <p className="font-display text-sm font-black text-emerald-900">
                {activeOrb.followUpQuestion}
              </p>
            </div>

            {/* Pilihan Jawaban */}
            <div className="space-y-2">
              {activeOrb.options.map((opt, idx) => {
                const isSelected = activePuzzle.selectedChoice === idx
                let btnStyle = 'border-slate-200 bg-white text-ink hover:border-emerald-400'

                if (activePuzzle.step === 'solved') {
                  if (opt.correct) {
                    btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold'
                  } else if (isSelected && !opt.correct) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-950'
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={activePuzzle.step === 'solved'}
                    onClick={() => answerPuzzleQuiz(idx)}
                    className={`w-full rounded-2xl border-2 p-3 text-left font-display text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] ${btnStyle}`}
                  >
                    <span className="mr-2 font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt.text}
                  </button>
                )
              })}
            </div>

            {/* Penjelasan & Hadiah */}
            {activePuzzle.step === 'solved' && (
              <div className="animate-fade-in space-y-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-3.5 text-white shadow-lg text-center">
                <p className="text-xs font-bold">{activeOrb.explanation}</p>
                <div className="flex items-center justify-center gap-3 font-extrabold text-xs bg-white/20 rounded-xl py-1 px-3">
                  <span>+4 💧 Pistol Air</span>
                  <span>+1 🛡️ Perisai</span>
                  <span>+250 ⭐</span>
                </div>
                <button
                  type="button"
                  onClick={closeLevel4Orb}
                  className="mt-1 w-full rounded-xl bg-white py-2 font-display text-xs font-extrabold text-emerald-800 shadow hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Ambil Hadiah & Tembak Laser! 🎯
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
