// Atur thread Rayon/Rust ke 1 sebelum modul native Rolldown/Vite diinisialisasi
// Mencegah lonjakan alokasi memori (OOM) pada mesin dengan RAM terbatas & server VPS Dokploy
process.env.RAYON_NUM_THREADS = process.env.RAYON_NUM_THREADS || '1'
process.env.TOKIO_WORKER_THREADS = process.env.TOKIO_WORKER_THREADS || '1'
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || '1'

import { build } from 'vite'

try {
  await build()
} catch (error) {
  console.error('Build gagal:', error)
  process.exit(1)
}
