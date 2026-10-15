/**
 * State pemain yang berubah setiap frame (posisi, tinggi tubuh, dll).
 * Sengaja TIDAK disimpan di Zustand agar tidak memicu re-render 60x/detik.
 * Ditulis oleh <Stickman>, dibaca oleh laser, kamera, dan sutradara game.
 */
export const player = {
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
  crouchT: 0, // 0 = berdiri, 1 = menunduk penuh
  time: 0, // waktu permainan aktif (detik)
  invulnUntil: 0,
}

export function resetPlayer() {
  Object.assign(player, { x: 0, y: 0, z: 0, yaw: 0, crouchT: 0, time: 0, invulnUntil: 0 })
}
