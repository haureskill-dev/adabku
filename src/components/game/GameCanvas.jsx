import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PCFShadowMap } from 'three'
import * as THREE from 'three'
import { player } from '../../game/playerState'
import { useGameStore } from '../../store/gameStore'
import Arena from './Arena'
import LaserTowerArena from './LaserTowerArena'
import FirstPersonPlayer from './FirstPersonPlayer'
import GameDirector from './GameDirector'
import LaserBoltObstacle from './LaserBoltObstacle'
import RealtimePlayers from './RealtimePlayers'
import CanvasErrorBoundary, { HTMLCanvasErrorBoundary } from './CanvasErrorBoundary'

/** Mengatur FOV kamera secara responsif di HP (layar portrait) agar tidak terdistorsi. */
function ResponsiveCameraFov() {
  const { camera, size } = useThree()

  useEffect(() => {
    if (!camera || !size) return
    const isPortrait = size.width < size.height
    camera.fov = isPortrait ? 62 : 65
    camera.updateProjectionMatrix()
  }, [camera, size])

  return null
}

/** Matahari hangat yang mengikuti pemain agar bayangan tetap tajam. */
function Sun() {
  const light = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    if (!light.current) return
    const px = player?.x ?? 0
    const pz = player?.z ?? 0
    light.current.position.set(px + 10, 20, pz + 8)
    target.position.set(px, 0, pz - 6)
    target.updateMatrixWorld()
  })

  return (
    <>
      <directionalLight
        ref={light}
        target={target}
        color="#fffbeb"
        intensity={2.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
      />
      <primitive object={target} />
    </>
  )
}

/** Fallback 3D aman jika terjadi error rendering */
function SafeFallbackScene() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#86efac" />
      </mesh>
      <mesh position={[0, 1.0, -5]}>
        <boxGeometry args={[4, 1.5, 0.4]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  )
}

/** Isi dunia 3D — di-remount setiap kali level / mode dimulai ulang. */
function World({ shields, checkpointIndex, laserReset, currentLevel, gameMode, playerName }) {
  const isLevel5 = currentLevel === 5
  const isMultiplayer = gameMode === 'multiplayer'

  return (
    <CanvasErrorBoundary fallback={<SafeFallbackScene />}>
      <ResponsiveCameraFov />

      {/* Jika Level 5: Tampilkan Open Area Arena dengan Menara Laser di tengah */}
      {isLevel5 ? (
        <>
          <LaserTowerArena />
          {isMultiplayer && <RealtimePlayers />}
        </>
      ) : (
        /* Jika Level 1-4: Koridor Runner Menuju Masjid / Sekolah / Rumah / Hutan */
        <>
          <Arena checkpointIndex={checkpointIndex} />
          {/* Tampilkan Pemain Asli Sesama Pengguna Secara Real-Time */}
          {isMultiplayer && <RealtimePlayers />}
          <LaserBoltObstacle laserReset={laserReset} />
          <GameDirector />
        </>
      )}

      {/* First-Person POV Controller (Kamera di mata pemain) + 3D Nametag */}
      <FirstPersonPlayer shields={shields} playerName={playerName} />

      <Sun />
    </CanvasErrorBoundary>
  )
}

export default function GameCanvas() {
  const phase = useGameStore((s) => s.phase)
  const runId = useGameStore((s) => s.runId)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const gameMode = useGameStore((s) => s.gameMode)
  const playerName = useGameStore((s) => s.playerName)
  const shields = useGameStore((s) => s.shields)
  const checkpointIndex = useGameStore((s) => s.checkpointIndex)
  const laserReset = useGameStore((s) => s.laserReset)

  // Saat pause / kuis / puzzle, render dibekukan untuk hemat baterai
  const frozen = phase === 'paused' || phase === 'quiz' || phase === 'puzzle'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-auto">
      <HTMLCanvasErrorBoundary>
        <Canvas
          id="game-canvas"
          shadows={{ type: PCFShadowMap }}
          frameloop={frozen ? 'demand' : 'always'}
          dpr={[1, 2]}
          camera={{ position: [0, 1.6, 5], fov: 65, near: 0.1, far: 100 }}
        >
          {/* Horizon atmosferik lembut */}
          <color attach="background" args={['#e0f2fe']} />
          <fog attach="fog" args={['#e0f2fe', 20, 95]} />

          <hemisphereLight args={['#f0f9ff', '#dcfce7', 1.0]} />
          <ambientLight intensity={0.4} color="#fffbeb" />

          <World
            key={`${runId}-${currentLevel}-${gameMode}`}
            shields={shields}
            checkpointIndex={checkpointIndex}
            laserReset={laserReset}
            currentLevel={currentLevel}
            gameMode={gameMode}
            playerName={playerName}
          />
        </Canvas>
      </HTMLCanvasErrorBoundary>
    </div>
  )
}
