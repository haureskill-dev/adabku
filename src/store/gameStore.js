import { create } from 'zustand'
import { LEVELS_CONFIG, LEVEL_5_ORBS } from '../data/adab'
import { RULES } from '../config/track'
import { sound } from '../utils/audio'

const BEST_KEY = 'adabku:best'
const PLAYER_NAME_KEY = 'adabku:player_name'
const PLAYER_GENDER_KEY = 'adabku:player_gender'
const GAME_MODE_KEY = 'adabku:game_mode'
const UNLOCKED_LEVELS_KEY = 'adabku:unlocked_levels'
const ROOM_CODE_KEY = 'adabku:room_code'

const readBest = () => {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY)) ?? null
  } catch {
    return null
  }
}

const readPlayerName = () => {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || 'Syamil'
  } catch {
    return 'Syamil'
  }
}

const readPlayerGender = () => {
  try {
    return localStorage.getItem(PLAYER_GENDER_KEY) || 'boy'
  } catch {
    return 'boy'
  }
}

const readGameMode = () => {
  try {
    return localStorage.getItem(GAME_MODE_KEY) || 'multiplayer'
  } catch {
    return 'multiplayer'
  }
}

const readRoomCode = () => {
  try {
    return localStorage.getItem(ROOM_CODE_KEY) || 'ADABKU123'
  } catch {
    return 'ADABKU123'
  }
}

const readUnlockedLevels = () => {
  try {
    const data = JSON.parse(localStorage.getItem(UNLOCKED_LEVELS_KEY))
    if (Array.isArray(data) && data.includes(1)) {
      return [...new Set(data)].sort((a, b) => a - b)
    }
    return [1]
  } catch {
    return [1]
  }
}

const shuffle = (arr) => {
  if (!Array.isArray(arr)) return []
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Pilih soal untuk tiap checkpoint sesuai level */
function pickQuizzes(level = 1) {
  const cfg = LEVELS_CONFIG[level]
  if (!cfg || !cfg.quizzes) return []
  return shuffle(cfg.quizzes)
}

const runState = (level = 1) => ({
  result: null, // 'selesai' | 'gagal'
  score: 0,
  hearts: RULES.maxHearts,
  shields: 1, // 1 perisai awal pelindung
  elapsed: 0,
  progress: 0,
  dodged: 0,
  hits: 0,
  quizCorrect: 0,
  checkpointIndex: 0,
  quizOrder: pickQuizzes(level),
  activeQuiz: null, // { quiz, picked: null | boolean, correct: boolean }
  toast: null, // { id, text, tone: 'good' | 'bad' | 'info' }
  laserReset: 0,
  rank: 1,
  totalRacers: 12,

  // Level 5 Arena State (Sumber Laser & Pistol Air)
  waterAmmo: level === 5 ? 4 : 0, // Amunisi awal di level 5
  waterShotTrigger: 0,
  towerHp: LEVELS_CONFIG[5]?.towerMaxHp ?? 8,
  towerMaxHp: LEVELS_CONFIG[5]?.towerMaxHp ?? 8,
  collectedOrbs: [],
  activeOrb: null,
  activePuzzle: null,
  waterHits: 0,
})

export const useGameStore = create((set, get) => ({
  phase: 'start', // 'start' | 'playing' | 'paused' | 'quiz' | 'puzzle' | 'finished'
  runId: 0,
  currentLevel: 1,
  gameMode: readGameMode(), // 'single' | 'multiplayer'
  roomCode: readRoomCode(),
  onboardingStep: 1, // 1: Landing, 2: Profil & Karakter, 3: Mode Game, 4: Pilih Level
  playerName: readPlayerName(),
  playerGender: readPlayerGender(), // 'boy' | 'girl'
  unlockedLevels: readUnlockedLevels(), // array e.g. [1, 2, ...]
  isMuted: false,
  best: readBest(),
  touch: { forward: false, backward: false, left: false, right: false, jump: false, crouch: false, shoot: false },
  joystick: { x: 0, y: 0, active: false },
  ...runState(1),

  connectionStatus: 'connecting', // 'connecting' | 'waiting' | 'connected'
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  isPointerLocked: false,
  setPointerLocked: (isPointerLocked) => set({ isPointerLocked }),

  /* ---------- Pengaturan Mode & Nama & Karakter & Room ---------- */
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),

  setGameMode: (gameMode) => {
    try {
      localStorage.setItem(GAME_MODE_KEY, gameMode)
    } catch {}
    set({ gameMode })
  },

  setRoomCode: (roomCode) => {
    const clean = (roomCode || 'ADABKU123').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || 'ADABKU123'
    try {
      localStorage.setItem(ROOM_CODE_KEY, clean)
    } catch {}
    set({ roomCode: clean })
  },

  setPlayerName: (playerName) => {
    const cleanName = playerName?.trim().slice(0, 16) || 'Syamil'
    try {
      localStorage.setItem(PLAYER_NAME_KEY, cleanName)
    } catch {}
    set({ playerName: cleanName })
  },

  setPlayerGender: (playerGender) => {
    const cleanGender = playerGender === 'girl' ? 'girl' : 'boy'
    try {
      localStorage.setItem(PLAYER_GENDER_KEY, cleanGender)
    } catch {}
    set({ playerGender: cleanGender })
  },

  /* ---------- Siklus Permainan ---------- */
  startGame: (level = null) => {
    const unlocked = get().unlockedLevels || [1]
    const target = level || get().currentLevel || 1
    const validLevel = unlocked.includes(target) ? target : 1
    sound.startBGM()
    set({
      ...runState(validLevel),
      currentLevel: validLevel,
      phase: 'playing',
      runId: get().runId + 1,
    })
  },

  nextLevel: () => {
    const current = get().currentLevel
    const nextLvl = Math.min(5, current + 1)
    let unlocked = get().unlockedLevels || [1]
    if (!unlocked.includes(nextLvl)) {
      unlocked = [...unlocked, nextLvl].sort((a, b) => a - b)
      try {
        localStorage.setItem(UNLOCKED_LEVELS_KEY, JSON.stringify(unlocked))
      } catch {}
    }
    sound.startBGM()
    set({
      ...runState(nextLvl),
      currentLevel: nextLvl,
      unlockedLevels: unlocked,
      phase: 'playing',
      runId: get().runId + 1,
    })
  },

  selectLevel: (level) => {
    const validLevel = Math.max(1, Math.min(5, level))
    const unlocked = get().unlockedLevels || [1]
    // Hanya bisa dipilih jika level sudah terbuka
    if (!unlocked.includes(validLevel)) return

    set({
      ...runState(validLevel),
      currentLevel: validLevel,
      phase: 'playing',
      runId: get().runId + 1,
    })
    sound.startBGM()
  },

  toggleSound: () => {
    const isMuted = sound.toggleMute()
    set({ isMuted })
  },

  togglePause: () => {
    const { phase } = get()
    if (phase === 'playing') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock?.()
      }
      set({ phase: 'paused', isPointerLocked: false })
    } else if (phase === 'paused') {
      set({ phase: 'playing' })
    }
  },

  finish: (result) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock?.()
    }
    const s = get()
    const score = result === 'selesai' ? s.score + RULES.pointsFinish : s.score
    let best = s.best
    if (!best || score > best.score) {
      best = { score, time: s.elapsed }
      try {
        localStorage.setItem(BEST_KEY, JSON.stringify(best))
      } catch {}
    }

    let unlockedLevels = s.unlockedLevels || [1]
    if (result === 'selesai' && s.currentLevel < 5) {
      const nextLvl = s.currentLevel + 1
      if (!unlockedLevels.includes(nextLvl)) {
        unlockedLevels = [...unlockedLevels, nextLvl].sort((a, b) => a - b)
        try {
          localStorage.setItem(UNLOCKED_LEVELS_KEY, JSON.stringify(unlockedLevels))
        } catch {}
      }
    }

    if (result === 'selesai') {
      sound.playWin() // Harmoni mulia tanpa tepuk tangan
    }

    set({ phase: 'finished', result, score, best, unlockedLevels })
  },

  /* ---------- Kuis Adab (Level 1-4) ---------- */
  openQuiz: () => {
    const { checkpointIndex, quizOrder, laserReset } = get()
    const quiz = quizOrder[checkpointIndex] || quizOrder[0]
    if (!quiz) return
    set({
      phase: 'quiz',
      activeQuiz: { quiz, picked: null, correct: false },
      laserReset: laserReset + 1,
    })
  },

  answerQuiz: (value) => {
    const s = get()
    if (!s.activeQuiz || s.activeQuiz.picked !== null) return
    const correct = value === s.activeQuiz.quiz.answer

    if (correct) {
      sound.playCorrect()
    } else {
      sound.playWrong()
    }

    set({
      activeQuiz: { ...s.activeQuiz, picked: value, correct },
      score: s.score + (correct ? RULES.pointsQuiz : 0),
      shields: correct ? Math.min(RULES.maxShields, s.shields + 1) : s.shields,
      quizCorrect: s.quizCorrect + (correct ? 1 : 0),
    })
  },

  closeQuiz: () =>
    set((s) => ({ phase: 'playing', activeQuiz: null, checkpointIndex: s.checkpointIndex + 1 })),

  /* ---------- Level 5: Orb Kuis & Puzzle 3x3 Arena ---------- */
  openLevel5Orb: (orbId) => {
    const s = get()
    if (s.collectedOrbs.includes(orbId)) return
    const orb = LEVEL_5_ORBS.find((o) => o.id === orbId)
    if (!orb) return

    if (orb.kind === 'puzzle') {
      set({
        phase: 'puzzle',
        activeOrb: orb,
        activePuzzle: {
          step: 'assemble', // 'assemble' | 'quiz' | 'solved'
          assembled: false,
          selectedChoice: null,
          correct: false,
        },
      })
    } else {
      set({
        phase: 'quiz',
        activeOrb: orb,
        activeQuiz: {
          quiz: {
            question: orb.question,
            answer: orb.answer,
            explanation: orb.explanation,
            type: orb.type,
            illustration: 'default',
          },
          picked: null,
          correct: false,
        },
      })
    }
  },

  openLevel4Orb: (orbId) => get().openLevel5Orb(orbId),

  answerLevel5Quiz: (value) => {
    const s = get()
    if (!s.activeQuiz || s.activeQuiz.picked !== null) return
    const correct = value === s.activeQuiz.quiz.answer

    if (correct) {
      sound.playCorrect()
    } else {
      sound.playWrong()
    }

    const orbId = s.activeOrb?.id
    set({
      activeQuiz: { ...s.activeQuiz, picked: value, correct },
      score: s.score + (correct ? RULES.pointsQuiz : 0),
      waterAmmo: correct ? s.waterAmmo + 4 : s.waterAmmo + 1, // Reward amunisi air
      shields: correct ? Math.min(RULES.maxShields, s.shields + 1) : s.shields,
      collectedOrbs: orbId && !s.collectedOrbs.includes(orbId) ? [...s.collectedOrbs, orbId] : s.collectedOrbs,
    })
  },

  answerLevel4Quiz: (value) => get().answerLevel5Quiz(value),

  closeLevel5Orb: () => {
    set({ phase: 'playing', activeQuiz: null, activeOrb: null, activePuzzle: null })
  },

  closeLevel4Orb: () => get().closeLevel5Orb(),

  solvePuzzleAssembly: () => {
    sound.playCorrect()
    set((s) => ({
      activePuzzle: {
        ...s.activePuzzle,
        step: 'quiz',
        assembled: true,
      },
    }))
  },

  answerPuzzleQuiz: (optionIndex) => {
    const s = get()
    if (!s.activePuzzle || s.activePuzzle.selectedChoice !== null) return
    const orb = s.activeOrb
    if (!orb || !orb.options) return

    const picked = orb.options[optionIndex]
    const correct = !!picked?.correct

    if (correct) {
      sound.playCorrect()
    } else {
      sound.playWrong()
    }

    const orbId = orb.id
    set({
      activePuzzle: {
        ...s.activePuzzle,
        step: 'solved',
        selectedChoice: optionIndex,
        correct,
      },
      score: s.score + (correct ? 250 : 50),
      waterAmmo: correct ? s.waterAmmo + 4 : s.waterAmmo + 1, // Reward amunisi pistol air
      shields: correct ? Math.min(RULES.maxShields, s.shields + 1) : s.shields,
      collectedOrbs: orbId && !s.collectedOrbs.includes(orbId) ? [...s.collectedOrbs, orbId] : s.collectedOrbs,
    })
  },

  /* ---------- Tembak Pistol Air (Water Gun - Level 5) ---------- */
  shootWater: () => {
    const s = get()
    if (s.phase !== 'playing' || s.currentLevel !== 5) return false
    if (s.waterAmmo <= 0) {
      get().showToast('💧 Amunisi air habis! Ambil butiran adab.', 'info')
      return false
    }

    sound.playWaterShoot()
    set({
      waterAmmo: s.waterAmmo - 1,
      waterShotTrigger: (s.waterShotTrigger || 0) + 1,
    })
    return true
  },

  damageTower: () => {
    const s = get()
    if (s.currentLevel !== 5 || s.phase !== 'playing') return
    sound.playTowerHit()
    const newHp = Math.max(0, s.towerHp - 1)
    set({ towerHp: newHp, score: s.score + 100, waterHits: s.waterHits + 1 })
    get().showToast('🎯 Tembakan air mengenai Sumber Laser!', 'good')

    if (newHp <= 0) {
      // Padam sepenuhnya -> MENANG UTAMA!
      setTimeout(() => {
        get().finish('selesai')
      }, 700)
    }
  },

  /* ---------- Laser (Rintangan) ---------- */
  hitLaser: (label = 'Adab Buruk') => {
    const s = get()
    if (s.phase !== 'playing') return
    if (s.shields > 0) {
      set({ shields: s.shields - 1 })
      get().showToast('🛡️ Perisai Adab melindungimu!', 'info')
      return
    }
    const hearts = s.hearts - 1
    set({ hearts, hits: s.hits + 1 })
    get().showToast(`Hindari: "${label}"`, 'bad')
    if (hearts <= 0) get().finish('gagal')
  },

  dodgeLaser: () => set((s) => ({ score: s.score + RULES.pointsDodge, dodged: s.dodged + 1 })),

  /* ---------- Lain-lain ---------- */
  setClock: (elapsed, progress) => set({ elapsed, progress }),
  setRank: (rank) => set({ rank }),
  showToast: (text, tone = 'info') => set({ toast: { id: Date.now() + Math.random(), text, tone } }),
  clearToast: (id) => set((s) => (s.toast?.id === id ? { toast: null } : {})),
  setTouch: (action, value) => set((s) => ({ touch: { ...s.touch, [action]: value } })),
  setJoystick: (x, y, active) => set({ joystick: { x, y, active } }),
}))
