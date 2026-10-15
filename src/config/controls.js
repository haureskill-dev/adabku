// Pemetaan tombol keyboard -> aksi karakter.
// Dipakai oleh <KeyboardControls> dari @react-three/drei.
export const Controls = {
  forward: 'forward',
  backward: 'backward',
  left: 'left',
  right: 'right',
  jump: 'jump',
  crouch: 'crouch',
}

// Catatan: Ctrl tidak dipakai untuk menunduk karena Ctrl+W menutup tab browser.
export const keyboardMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.crouch, keys: ['ShiftLeft', 'ShiftRight', 'KeyC'] },
]

// Parameter fisika & gerak karakter
export const PLAYER = {
  walkSpeed: 5,
  crouchSpeed: 2.2,
  jumpVelocity: 8.5,
  gravity: 24,
  turnSpeed: 12,
  invulnSeconds: 1.2, // kebal sesaat setelah terkena laser
}
