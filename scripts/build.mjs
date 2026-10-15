import { spawnSync } from 'child_process'

// Pastikan Rayon/Rust menggunakan 1 worker thread untuk mencegah lonjakan memori pada RAM terbatas
process.env.RAYON_NUM_THREADS = '1'

const isWindows = process.platform === 'win32'
const cmd = isWindows ? 'npx.cmd' : 'npx'

const result = spawnSync(cmd, ['vite', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})

process.exit(result.status ?? 0)
