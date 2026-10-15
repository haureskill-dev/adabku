import React from 'react'

/**
 * ErrorBoundary khusus untuk komponen 3D React Three Fiber (di dalam <Canvas>).
 * Mencegah crash jika terjadi kesalahan kalkulasi geometri atau properti undefined.
 */
export class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Canvas 3D Error Caught by ErrorBoundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback 3D minimal jika berada di dalam <Canvas>
      return (
        <group>
          <mesh position={[0, 1.2, -4]}>
            <boxGeometry args={[4, 2, 0.2]} />
            <meshStandardMaterial color="#f87171" roughness={0.3} />
          </mesh>
        </group>
      )
    }

    return this.props.children
  }
}

/**
 * ErrorBoundary HTML (di luar <Canvas>).
 * Menangani kasus WebGL konteks gagal dibuat pada HP dengan browser lama atau WebGL disabled.
 */
export class HTMLCanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Canvas initialization warning:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-sky-100 to-emerald-50 text-slate-800">
          <div className="text-5xl mb-3">🌱</div>
          <h2 className="font-display text-xl font-black text-emerald-800">
            Arena 3D Adabku
          </h2>
          <p className="text-xs font-semibold text-slate-600 mt-1 max-w-sm">
            Sedang menginisialisasi grafis 3D. Jika layar tetap seperti ini, pastikan akselerasi perangkat keras WebGL diaktifkan pada pengaturan browser Anda.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 font-display text-xs font-black text-white shadow-lg active:scale-95 transition-all hover:bg-emerald-700"
          >
            Muat Ulang Tampilan ↺
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default CanvasErrorBoundary
