// Konfigurasi lintasan koridor lurus (arah maju = sumbu -Z).

export const CORRIDOR_WIDTH = 8
export const START_Z = 0
export const FINISH_Z = -200
export const TRACK_LENGTH = START_Z - FINISH_Z

// Posisi gerbang Kuis Adab di sepanjang lintasan
export const CHECKPOINTS = [-40, -80, -120, -160]

// Batas gerak pemain di dalam koridor
export const BOUNDS = {
  minX: -CORRIDOR_WIDTH / 2 + 0.5,
  maxX: CORRIDOR_WIDTH / 2 - 0.5,
  maxZ: START_Z + 4,
  minZ: FINISH_Z - 3,
}

// Laser adab buruk
export const LASER = {
  lowY: 0.38, // laser rendah -> harus MELOMPAT (lompat mencapai y > 0.55m)
  highY: 1.22, // laser tinggi -> harus MENUNDUK (tinggi menunduk gepeng = 0.70m)
  thickness: 0.08,
  baseSpeed: 8, // m/detik menuju pemain
  spawnAhead: 32, // jarak muncul di depan pemain
  firstDelay: 2.5,
  intervalMin: 2.2,
  intervalMax: 3.4,
}

// Ukuran tubuh kapsul untuk deteksi tabrakan laser presisi
export const BODY = {
  standTop: 1.30, // tinggi puncak kapsul saat berdiri normal
  crouchTop: 0.70, // tinggi puncak kapsul saat menunduk (gepeng squash)
}

export const RULES = {
  maxHearts: 3,
  maxShields: 3,
  pointsDodge: 10,
  pointsQuiz: 50,
  pointsFinish: 100,
}

// Palet warna 3D (pastel modern yang bersih ala AI Studio)
export const PALETTE = {
  grass: '#86efac',
  grassDark: '#4ade80',
  sky: '#e0f2fe',
  skyLight: '#f0f9ff',
  sun: '#fde047',
  orange: '#fb923c',
  cream: '#f8fafc',
  white: '#ffffff',
  navy: '#334155',
  laser: '#ff2442',
  laserGlow: '#ff6b81',
}
