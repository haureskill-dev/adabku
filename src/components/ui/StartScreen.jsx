import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { BigButton, Overlay, formatTime } from './primitives'
import AdabkuLogo from './AdabkuLogo'

/**
 * Preview Visual 3D Kapsul SD Laki-laki (Strictly Faceless):
 * - Kapsul Geometris dengan seragam SD (Kemeja Putih + Celana Merah)
 * - Peci / Songkok Hitam Polos di atas kepala kapsul
 * - Bebas mata/hidung/mulut (100% Faceless Syariat Compliant)
 */
function BoyCapsulePreview({ selected = false }) {
  return (
    <div className="relative mx-auto my-1 flex h-24 w-16 items-center justify-center">
      <svg viewBox="0 0 80 125" className="h-full w-full drop-shadow-md">
        {/* Bayangan lantai */}
        <ellipse cx="40" cy="118" rx="24" ry="5" fill="#000000" opacity="0.16" />

        <defs>
          <clipPath id="boyClip">
            <rect x="18" y="8" width="44" height="106" rx="22" ry="22" />
          </clipPath>
        </defs>

        {/* Konten Kapsul Terpotong Rapi Sesuai Referensi Gambar */}
        <g clipPath="url(#boyClip)">
          {/* 1. Sepatu Hitam di Bawah */}
          <rect x="18" y="96" width="44" height="20" fill="#1e293b" />
          {/* Garis pemisah sepatu */}
          <line x1="40" y1="96" x2="40" y2="114" stroke="#0f172a" strokeWidth="1.5" />

          {/* 2. Kaos Kaki Putih */}
          <rect x="18" y="90" width="44" height="6" fill="#ffffff" />
          <line x1="40" y1="90" x2="40" y2="96" stroke="#e2e8f0" strokeWidth="1" />

          {/* 3. Celana Merah SD */}
          <rect x="18" y="60" width="44" height="30" fill="#dc2626" />
          <line x1="40" y1="64" x2="40" y2="90" stroke="#991b1b" strokeWidth="1.5" />

          {/* 4. Kemeja Putih SD */}
          <rect x="18" y="38" width="44" height="22" fill="#ffffff" />

          {/* Kerah Putih & Dasi Merah SD */}
          <path d="M 28 38 L 40 46 L 52 38" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Dasi Merah Panjang */}
          <polygon points="40,43 37,45 37,56 40,60 43,56 43,45" fill="#dc2626" />
          {/* Simpul Dasi */}
          <polygon points="38,42 42,42 41,45 39,45" fill="#b91c1c" />

          {/* 5. Rambut Hitam Samping */}
          <rect x="18" y="24" width="44" height="16" fill="#292524" />

          {/* 6. Wajah Kulit Peach Polos (100% Faceless) */}
          <rect x="21" y="24" width="38" height="15" rx="4" fill="#fed7aa" />

          {/* 7. Topi SD Merah Putih */}
          {/* Mahkota Topi Merah */}
          <path d="M 18 8 Q 40 3 62 8 L 62 25 L 18 25 Z" fill="#dc2626" />
          {/* Panel Depan Putih Khas Topi SD */}
          <path d="M 27 25 Q 28 14 40 14 Q 52 14 53 25 Z" fill="#ffffff" />
          {/* Lambang Garuda / SD Kuning Emas */}
          <path
            d="M 40 17 L 38 19 L 39 21 L 40 20 L 41 21 L 42 19 Z"
            fill="#f59e0b"
          />
          {/* Pet / Visor Topi Merah */}
          <path d="M 16 25 Q 40 30 64 25 Q 40 23 16 25" fill="#b91c1c" />
        </g>

        {/* Outline Halus Kapsul */}
        <rect
          x="18"
          y="8"
          width="44"
          height="106"
          rx="22"
          ry="22"
          fill="none"
          stroke={selected ? '#10b981' : '#334155'}
          strokeWidth={selected ? '3' : '2'}
        />
      </svg>
    </div>
  )
}

function GirlCapsulePreview({ selected = false }) {
  return (
    <div className="relative mx-auto my-1 flex h-24 w-16 items-center justify-center">
      <svg viewBox="0 0 80 125" className="h-full w-full drop-shadow-md">
        {/* Bayangan lantai */}
        <ellipse cx="40" cy="118" rx="24" ry="5" fill="#000000" opacity="0.16" />

        <defs>
          <clipPath id="girlClip">
            <rect x="18" y="8" width="44" height="106" rx="22" ry="22" />
          </clipPath>
        </defs>

        {/* Konten Kapsul Terpotong Rapi Sesuai Referensi Gambar */}
        <g clipPath="url(#girlClip)">
          {/* 1. Sepatu Hitam di Bawah */}
          <rect x="18" y="96" width="44" height="20" fill="#1e293b" />
          <line x1="40" y1="96" x2="40" y2="114" stroke="#0f172a" strokeWidth="1.5" />

          {/* 2. Kaos Kaki Putih */}
          <rect x="18" y="90" width="44" height="6" fill="#ffffff" />

          {/* 3. Rok Rempel / Lipit Merah SD */}
          <rect x="18" y="58" width="44" height="32" fill="#dc2626" />
          {/* Garis-garis Rempel / Lipit Khas Rok SD */}
          <line x1="24" y1="58" x2="23" y2="90" stroke="#991b1b" strokeWidth="1.5" />
          <line x1="30" y1="58" x2="29" y2="90" stroke="#991b1b" strokeWidth="1.5" />
          <line x1="36" y1="58" x2="35" y2="90" stroke="#991b1b" strokeWidth="1.5" />
          <line x1="40" y1="58" x2="40" y2="90" stroke="#991b1b" strokeWidth="1.5" />
          <line x1="45" y1="58" x2="46" y2="90" stroke="#991b1b" strokeWidth="1.5" />
          <line x1="51" y1="58" x2="52" y2="90" stroke="#991b1b" strokeWidth="1.5" />
          <line x1="57" y1="58" x2="58" y2="90" stroke="#991b1b" strokeWidth="1.5" />

          {/* 4. Baju Kurung / Jilbab Putih Menutupi Dada */}
          <rect x="18" y="38" width="44" height="20" fill="#ffffff" />
          {/* Badge / Lambang Sekolah di Dada Kiri */}
          <path
            d="M 52 46 Q 52 44 54 44 Q 56 44 56 46 L 56 49 Q 54 51 52 49 Z"
            fill="#dc2626"
            stroke="#f59e0b"
            strokeWidth="0.8"
          />

          {/* 5. Jilbab Putih Bersih di Kepala */}
          <rect x="18" y="8" width="44" height="42" fill="#ffffff" />

          {/* 6. Bukaan Wajah Oval Peach (100% Faceless) */}
          <ellipse cx="40" cy="30" rx="14" ry="16" fill="#fed7aa" />
        </g>

        {/* Outline Halus Kapsul */}
        <rect
          x="18"
          y="8"
          width="44"
          height="106"
          rx="22"
          ry="22"
          fill="none"
          stroke={selected ? '#ec4899' : '#334155'}
          strokeWidth={selected ? '3' : '2'}
        />
      </svg>
    </div>
  )
}

export default function StartScreen() {
  const startGame = useGameStore((s) => s.startGame)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const selectLevel = useGameStore((s) => s.selectLevel)
  const gameMode = useGameStore((s) => s.gameMode)
  const setGameMode = useGameStore((s) => s.setGameMode)
  const roomCode = useGameStore((s) => s.roomCode || 'ADABKU123')
  const setRoomCode = useGameStore((s) => s.setRoomCode)
  const playerName = useGameStore((s) => s.playerName)
  const setPlayerName = useGameStore((s) => s.setPlayerName)
  const playerGender = useGameStore((s) => s.playerGender)
  const setPlayerGender = useGameStore((s) => s.setPlayerGender)
  const unlockedLevels = useGameStore((s) => s.unlockedLevels || [1])
  const onboardingStep = useGameStore((s) => s.onboardingStep || 1)
  const setOnboardingStep = useGameStore((s) => s.setOnboardingStep)
  const best = useGameStore((s) => s.best)

  const [inputName, setInputName] = useState(playerName || 'Ahmad')
  const [inputRoom, setInputRoom] = useState(roomCode || 'ADABKU123')

  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 15)
    setInputName(val)
    setPlayerName(val)
  }

  const handleRoomChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
    setInputRoom(val)
    setRoomCode(val)
  }

  const handleStart = () => {
    const defaultName = playerGender === 'girl' ? 'Aisyah' : 'Ahmad'
    const finalName = inputName.trim() || defaultName
    setPlayerName(finalName)
    setRoomCode(inputRoom.trim() || 'ADABKU123')
    const targetLvl = unlockedLevels.includes(currentLevel) ? currentLevel : 1
    startGame(targetLvl)
  }

  // 5 Level Simpel Sesuai Spesifikasi (Level 1 s.d. 5)
  const SIMPLE_LEVELS = [
    { id: 1, name: 'Level 1: Masjid', icon: '🕌', theme: 'Adab Beribadah & Shalat' },
    { id: 2, name: 'Level 2: Rumah', icon: '🏡', theme: 'Adab Orang Tua & Keluarga' },
    { id: 3, name: 'Level 3: Sekolah', icon: '🏫', theme: 'Adab Guru, Teman, & Belajar' },
    { id: 4, name: 'Level 4: Hutan & Alam', icon: '🌿', theme: 'Kelestarian Lingkungan' },
    { id: 5, name: 'Level 5: Arena Laser', icon: '🎯', theme: 'Padamkan Perilaku Buruk' },
  ]

  return (
    <Overlay labelledBy="onboarding-title" transparentBackdrop={true} className="text-center max-w-lg border-3 border-emerald-400 bg-white shadow-2xl rounded-3xl p-5 sm:p-7">
      {/* Header Konsisten di Langkah 2, 3, 4: Logo Bulat + Judul Adabku */}
      {onboardingStep > 1 && (
        <div className="mb-3.5 flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <AdabkuLogo size="sm" />
            <div className="text-left leading-none">
              <span className="font-display text-lg font-black text-emerald-800 tracking-tight">
                Adabku
              </span>
              <p className="text-[10px] font-extrabold text-emerald-600">
                Pendidikan Karakter SD
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800">
            Langkah {onboardingStep} / 4
          </span>
        </div>
      )}

      {/* Indikator Progres Langkah (Step 1 s.d. 4) */}
      <div className="mb-4 flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              onboardingStep === step
                ? 'w-10 bg-emerald-500 shadow-sm'
                : onboardingStep > step
                ? 'w-4 bg-emerald-300'
                : 'w-4 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* =======================================================================
          LANGKAH 1: LAYAR SELAMAT DATANG (LANDING SCREEN CERIA & BEBAS BLUR)
          ======================================================================= */}
      {onboardingStep === 1 && (
        <div className="space-y-4 py-2">
          {/* Logo Bulat Adabku Ikonik */}
          <div className="flex justify-center">
            <AdabkuLogo size="xl" className="shadow-lg border-4 border-emerald-400 ring-4 ring-emerald-100" />
          </div>

          <div>
            <h1 id="onboarding-title" className="font-display text-4xl sm:text-5xl font-extrabold text-emerald-800 tracking-tight">
              Adabku
            </h1>
            <p className="mt-1 font-bold text-emerald-600 text-sm sm:text-base">
              Petualangan Karakter & Adab Mulia Anak SD
            </p>
          </div>

          {/* Kotak Pesan Ceria Pastel (Solid Tanpa Blur) */}
          <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-emerald-50 to-amber-50 p-4 border-2 border-emerald-200 text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed shadow-sm">
            Selamat datang! Yuk belajar menghormati orang tua, tertib di masjid dan sekolah, menyayangi alam sekitar, dan melatih kedisiplinan dalam petualangan 3D yang seru dan menyenangkan!
          </div>

          <BigButton
            id="landing-next-button"
            variant="green"
            className="w-full text-lg sm:text-xl py-4 shadow-emerald-700/40"
            onClick={() => setOnboardingStep(2)}
            autoFocus
          >
            Siap Belajar & Mainkan ➔
          </BigButton>

          {best && (
            <p className="text-xs font-extrabold text-slate-500">
              ⭐ Rekor Terbaik: {best.score} poin ({formatTime(best.time)})
            </p>
          )}
        </div>
      )}

      {/* =======================================================================
          LANGKAH 2: PROFIL KARAKTER KAPSUL (PECI vs JILBAB, STRICTLY FACELESS)
          ======================================================================= */}
      {onboardingStep === 2 && (
        <div className="space-y-4 text-left py-1">
          <div className="text-center">
            <h2 id="onboarding-title" className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-950">
              Pilih Karakter & Nama
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Model 3D Kapsul Geometris murni tanpa wajah (Faceless Syariat)
            </p>
          </div>

          {/* Kartu Pilihan Kapsul: Laki-laki (Peci) vs Perempuan (Jilbab) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlayerGender('boy')}
              className={`rounded-2xl border-3 p-3 text-center transition-all active:scale-95 ${
                playerGender === 'boy'
                  ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <BoyCapsulePreview selected={playerGender === 'boy'} />
              <div className="font-display text-sm sm:text-base font-black text-slate-900 mt-1">
                Laki-laki
              </div>
              <p className="text-[10px] font-bold text-slate-600 mt-0.5 leading-tight">
                Kapsul SD + <strong className="text-emerald-700">Peci Hitam</strong>
              </p>
              <span className="mt-1.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                Polos Faceless
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlayerGender('girl')}
              className={`rounded-2xl border-3 p-3 text-center transition-all active:scale-95 ${
                playerGender === 'girl'
                  ? 'border-pink-500 bg-pink-50 shadow-md ring-2 ring-pink-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <GirlCapsulePreview selected={playerGender === 'girl'} />
              <div className="font-display text-sm sm:text-base font-black text-slate-900 mt-1">
                Perempuan
              </div>
              <p className="text-[10px] font-bold text-slate-600 mt-0.5 leading-tight">
                Kapsul SD + <strong className="text-pink-700">Jilbab Putih</strong>
              </p>
              <span className="mt-1.5 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-black text-pink-800">
                Polos Faceless
              </span>
            </button>
          </div>

          {/* Form Input Nama Simpel */}
          <div className="rounded-2xl bg-slate-50 p-3.5 border-2 border-slate-200 shadow-sm">
            <label htmlFor="player-name-input" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Ketik Nama Panggilanmu:
            </label>
            <input
              id="player-name-input"
              type="text"
              value={inputName}
              onChange={handleNameChange}
              placeholder={playerGender === 'girl' ? 'Contoh: Aisha / Fatimah' : 'Contoh: Ahmad / Syamil'}
              maxLength={15}
              className="w-full rounded-xl border-2 border-emerald-400 bg-white px-3.5 py-2.5 font-display text-sm font-bold text-slate-900 shadow-inner focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Tombol Navigasi */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOnboardingStep(1)}
              className="w-1/3 rounded-2xl border-2 border-slate-300 py-3.5 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            >
              ⬅ Kembali
            </button>
            <BigButton
              variant="green"
              className="w-2/3 text-base sm:text-lg py-3.5"
              onClick={() => setOnboardingStep(3)}
            >
              Lanjut ➔
            </BigButton>
          </div>
        </div>
      )}

      {/* =======================================================================
          LANGKAH 3: PILIHAN MODE GAME (SINGLE PLAYER vs MULTIPLAYER ROOM)
          ======================================================================= */}
      {onboardingStep === 3 && (
        <div className="space-y-4 text-left py-1">
          <div className="text-center">
            <h2 id="onboarding-title" className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-950">
              Pilih Mode Game
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Pilih bermain mandiri atau petualangan bersama teman
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGameMode('single')}
              className={`rounded-2xl border-3 p-3.5 text-left transition-all active:scale-95 ${
                gameMode === 'single'
                  ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white text-xl font-black mb-2 shadow-sm">
                ⭐
              </div>
              <div className="font-display text-sm font-black text-slate-900">
                Single Player
              </div>
              <p className="text-[10px] text-slate-600 font-bold mt-1">
                Petualangan mandiri menyelesaikan misi & adab tiap level
              </p>
            </button>

            <button
              type="button"
              onClick={() => setGameMode('multiplayer')}
              className={`rounded-2xl border-3 p-3.5 text-left transition-all active:scale-95 ${
                gameMode === 'multiplayer'
                  ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="grid size-11 place-items-center rounded-xl bg-sky-600 text-white text-xl font-black mb-2 shadow-sm">
                🌐
              </div>
              <div className="font-display text-sm font-black text-slate-900">
                Multiplayer
              </div>
              <p className="text-[10px] text-slate-600 font-bold mt-1">
                Bermain bersama teman secara real-time via Kode Room P2P
              </p>
            </button>
          </div>

          {/* Form Kode Room Jika Mode Multiplayer */}
          {gameMode === 'multiplayer' && (
            <div className="rounded-2xl bg-sky-50 p-3.5 border-2 border-sky-200 shadow-sm">
              <label htmlFor="room-code-input" className="block text-xs font-black uppercase text-sky-900 mb-1">
                Kode Room Bersama (HP & Laptop):
              </label>
              <input
                id="room-code-input"
                type="text"
                value={inputRoom}
                onChange={handleRoomChange}
                placeholder="ADABKU123"
                maxLength={12}
                className="w-full rounded-xl border-2 border-sky-400 bg-white px-3.5 py-2 font-mono text-base font-black tracking-widest text-sky-950 uppercase shadow-inner focus:border-sky-600 focus:outline-none"
              />
              <p className="mt-1.5 text-[10px] font-bold text-sky-700">
                💡 Masukkan kode yang sama di HP dan Laptop agar kapsul saling terhubung secara otomatis!
              </p>
            </div>
          )}

          {/* Tombol Navigasi */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOnboardingStep(2)}
              className="w-1/3 rounded-2xl border-2 border-slate-300 py-3.5 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            >
              ⬅ Kembali
            </button>
            <BigButton
              variant="green"
              className="w-2/3 text-base sm:text-lg py-3.5"
              onClick={() => setOnboardingStep(4)}
            >
              Lanjut ➔
            </BigButton>
          </div>
        </div>
      )}

      {/* =======================================================================
          LANGKAH 4: PEMILIHAN LEVEL SIMPEL (LEVEL 1 s.d. 5 + PROGRESSION LOCK)
          ======================================================================= */}
      {onboardingStep === 4 && (
        <div className="space-y-4 text-left py-1">
          <div className="text-center">
            <h2 id="onboarding-title" className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-950">
              Pilih Level
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Level terbuka bertahap setelah level sebelumnya diselesaikan
            </p>
          </div>

          {/* 5 Kotak Level Bersih */}
          <div className="grid grid-cols-1 gap-2 sm:gap-2.5 max-h-56 overflow-y-auto pr-1">
            {SIMPLE_LEVELS.map((lvl) => {
              const isUnlocked = unlockedLevels.includes(lvl.id)
              const isSelected = currentLevel === lvl.id

              return (
                <button
                  key={lvl.id}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => selectLevel(lvl.id)}
                  className={`flex items-center justify-between rounded-2xl border-2 p-3 transition-all active:scale-98 ${
                    !isUnlocked
                      ? 'border-slate-200 bg-slate-100/80 opacity-60 cursor-not-allowed text-slate-400'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300 text-emerald-950'
                      : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lvl.icon}</span>
                    <div className="text-left">
                      <div className="font-display text-sm font-black">
                        {lvl.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {lvl.theme}
                      </div>
                    </div>
                  </div>

                  <div>
                    {!isUnlocked ? (
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-600">
                        🔒 Terkunci
                      </span>
                    ) : isSelected ? (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-white">
                        ✓ Dipilih
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800">
                        Terbuka
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Tombol Mulai Permainan */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOnboardingStep(3)}
              className="w-1/3 rounded-2xl border-2 border-slate-300 py-3.5 text-xs font-black text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            >
              ⬅ Kembali
            </button>
            <BigButton
              id="start-button"
              variant="green"
              className="w-2/3 text-base sm:text-lg py-3.5 shadow-emerald-700/40"
              onClick={handleStart}
            >
              🚀 Mulai Main!
            </BigButton>
          </div>
        </div>
      )}
    </Overlay>
  )
}
