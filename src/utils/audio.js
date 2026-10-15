/**
 * Sistem Audio Web Audio API untuk Game Adabku.
 * - NO BGM: Musik latar belakang dihilangkan 100% sesuai instruksi.
 * - SFX laser sci-fi lembut.
 * - SFX jawaban benar (ting/chime lembut) & salah (nada ramah).
 * - SFX tembakan pistol air & benturan air ke tower.
 * - STRICTLY NO CLAPPING (tidak ada tepuk tangan sama sekali).
 */

class SoundSystem {
  constructor() {
    this.ctx = null
    this.sfxGain = null
    this.isMuted = false
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    this.ctx = new AudioContext()

    this.sfxGain = this.ctx.createGain()
    this.sfxGain.gain.value = 0.35
    this.sfxGain.connect(this.ctx.destination)
  }

  ensureContext() {
    this.init()
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.35
    }
    return this.isMuted
  }

  // NO BGM: Di-disable total (no-op)
  startBGM() {
    // Tidak ada musik latar belakang
  }

  stopBGM() {
    // Tidak ada musik latar belakang
  }

  /** SFX Laser Sci-fi Lembut */
  playLaser() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(700, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.14)

      gain.gain.setValueAtTime(0.16, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14)

      osc.connect(gain)
      gain.connect(this.sfxGain)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.16)
    } catch {}
  }

  /** SFX Jawaban Benar: Nada Ting/Chime Lembut (STRICTLY NO CLAPPING) */
  playCorrect() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (chord arpeggio lembut)
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07)

        gain.gain.setValueAtTime(0.01, this.ctx.currentTime + idx * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.07 + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.4)

        osc.connect(gain)
        gain.connect(this.sfxGain)

        osc.start(this.ctx.currentTime + idx * 0.07)
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.42)
      })
    } catch {}
  }

  /** SFX Jawaban Salah: Nada Ramah Halus (Tidak Menakutkan) */
  playWrong() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(165, this.ctx.currentTime + 0.22)

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25)

      osc.connect(gain)
      gain.connect(this.sfxGain)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.26)
    } catch {}
  }

  /** SFX Tembakan Pistol Air (Water Gun) */
  playWaterShoot() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.05)
      osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.13)

      osc.connect(gain)
      gain.connect(this.sfxGain)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.14)
    } catch {}
  }

  /** SFX Cipratan Air Mengenai Sumber Laser */
  playTowerHit() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.16)

      gain.gain.setValueAtTime(0.16, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18)

      osc.connect(gain)
      gain.connect(this.sfxGain)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.2)
    } catch {}
  }

  /** SFX Menggeser Keping Puzzle 3x3 */
  playPuzzleMove() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(480, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09)

      osc.connect(gain)
      gain.connect(this.sfxGain)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.1)
    } catch {}
  }

  /** SFX Kemenangan Level / Tamat (Harmoni Nada Mulia, STRICTLY NO CLAPPING) */
  playWin() {
    if (this.isMuted) return
    this.ensureContext()
    if (!this.ctx) return

    try {
      const chords = [
        [523.25, 659.25, 783.99], // C mayor
        [587.33, 739.99, 880.0],  // D mayor
        [659.25, 830.61, 987.77], // E mayor
        [783.99, 987.77, 1174.66, 1567.98], // G fanfare mulia
      ]

      chords.forEach((chord, step) => {
        chord.forEach((freq) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + step * 0.18)

          gain.gain.setValueAtTime(0.01, this.ctx.currentTime + step * 0.18)
          gain.gain.exponentialRampToValueAtTime(0.14, this.ctx.currentTime + step * 0.18 + 0.04)
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + step * 0.18 + 0.55)

          osc.connect(gain)
          gain.connect(this.sfxGain)

          osc.start(this.ctx.currentTime + step * 0.18)
          osc.stop(this.ctx.currentTime + step * 0.18 + 0.6)
        })
      })
    } catch {}
  }
}

export const sound = new SoundSystem()
