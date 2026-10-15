import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

/**
 * Model Karakter Kapsul Edukasi SD Faceless (Syariat Compliant).
 * - Pilihan Karakter:
 *   1) Anak SD Laki-laki: Seragam SD Putih-Merah + Peci Hitam Polos.
 *   2) Anak SD Perempuan: Seragam SD Putih-Merah + Jilbab Putih Polos.
 * - Strictly Faceless: Polos tanpa mata, hidung, atau mulut.
 * - Animasi squash & stretch prosedural imut, tangan & kaki melayang lincah.
 */
export default function CapsuleCharacter({
  gender: propGender, // 'boy' | 'girl' (opsional, jika tidak ada baca dari store)
  color, // override warna opsional
  accentColor,
  crouchT = 0, // 0 = berdiri, 1 = menunduk gepeng
  isJumping = false,
  isWalking = false,
  steerTilt = 0,
  forwardTilt = 0,
  runPhase = 0,
  shields = 0,
  invulnerable = false,
}) {
  const storeGender = useGameStore((s) => s.playerGender)
  const gStr = String(propGender || storeGender || 'boy').toLowerCase()
  const isGirl = gStr.includes('girl') || gStr.includes('perempuan')

  const root = useRef()
  const bodyGroup = useRef()
  const leftHand = useRef()
  const rightHand = useRef()
  const leftFoot = useRef()
  const rightFoot = useRef()
  const shadowMesh = useRef()

  // Material Seragam SD & Peci / Jilbab
  const shirtMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color || '#f8fafc', // Putih kemeja SD bersih
        roughness: 0.3,
        metalness: 0.05,
      }),
    [color],
  )

  const redMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accentColor || '#dc2626', // Merah khas celana/rok SD
        roughness: 0.35,
        metalness: 0.05,
      }),
    [accentColor],
  )

  const peciMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#18181b', // Hitam pekat beludru peci
        roughness: 0.85,
        metalness: 0.05,
      }),
    [],
  )

  const jilbabMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff', // Putih jilbab polos
        roughness: 0.45,
        metalness: 0.02,
      }),
    [],
  )

  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fde68a', // Warna kulit pastel polos (faceless)
        roughness: 0.35,
        metalness: 0.05,
      }),
    [],
  )

  const beltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.4,
        metalness: 0.1,
      }),
    [],
  )

  // Hitung efek squash & stretch prosedural imut
  const bounce = isWalking && !isJumping ? Math.abs(Math.sin(runPhase * 2)) * 0.08 : 0

  let targetScaleY = 1 + bounce
  let targetScaleXZ = 1 - bounce * 0.5

  if (isJumping) {
    targetScaleY = 1.25
    targetScaleXZ = 0.88
  }

  // Saat menunduk: tubuh menjadi gepeng imut meluncur di lantai
  const finalScaleY = THREE.MathUtils.lerp(targetScaleY, 0.52, crouchT)
  const finalScaleXZ = THREE.MathUtils.lerp(targetScaleXZ, 1.45, crouchT)
  const bodyCenterY = THREE.MathUtils.lerp(0.65, 0.35, crouchT)

  // Gerak tangan & kaki imut
  const armSwing = isWalking && !isJumping ? Math.sin(runPhase) * 0.35 : 0
  const legSwing = isWalking && !isJumping ? Math.sin(runPhase) * 0.25 : 0
  const jumpArmY = isJumping ? 0.3 : 0

  return (
    <group ref={root}>
      {/* 1. Kontak bayangan bulat lembut di lantai */}
      <mesh
        ref={shadowMesh}
        rotation-x={-Math.PI / 2}
        position={[0, 0.02, 0]}
        scale={isJumping ? [0.7, 0.7, 1] : [finalScaleXZ * 0.9, finalScaleXZ * 0.9, 1]}
      >
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={isJumping ? 0.15 : 0.32} />
      </mesh>

      {/* 2. Badan Kapsul Utama dengan Animasi Squash, Stretch & Tilt */}
      <group
        ref={bodyGroup}
        position={[0, bodyCenterY, 0]}
        rotation-z={steerTilt * -0.22}
        rotation-x={forwardTilt * 0.15}
        scale={[finalScaleXZ, finalScaleY, finalScaleXZ]}
      >
        {/* Kapsul Dasar (Kulit Pastel Bersih / Faceless) */}
        <mesh castShadow receiveShadow material={skinMat}>
          <capsuleGeometry args={[0.31, 0.62, 16, 24]} />
        </mesh>

        {/* Bagian Baju Seragam SD Atas (Kemeja Putih) */}
        <mesh position={[0, 0.06, 0]} material={shirtMat}>
          <cylinderGeometry args={[0.325, 0.335, 0.34, 24]} />
        </mesh>

        {/* Bagian Celana / Rok Seragam SD Bawah (Merah SD) */}
        <mesh position={[0, -0.21, 0]} material={redMat}>
          {isGirl ? (
            <cylinderGeometry args={[0.33, 0.42, 0.38, 24]} />
          ) : (
            <cylinderGeometry args={[0.325, 0.31, 0.32, 24]} />
          )}
        </mesh>

        {/* Sabuk Hitam SD di Pinggang */}
        <mesh position={[0, -0.06, 0]} material={beltMat}>
          <torusGeometry args={[0.332, 0.025, 8, 24]} />
        </mesh>

        {/* Dasi Merah SD Segitiga di Dada (Anak Laki-laki) */}
        {!isGirl && (
          <group position={[0, 0.07, 0.33]}>
            <mesh>
              <coneGeometry args={[0.07, 0.22, 3]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#b91c1c" />
            </mesh>
          </group>
        )}

        {/* Pilihan 1: PECI HITAM POLOS (Anak SD Laki-laki) */}
        {!isGirl && (
          <group position={[0, 0.39, 0]} scale={[0.92, 1, 1.05]}>
            <mesh castShadow material={peciMat}>
              <cylinderGeometry args={[0.26, 0.28, 0.2, 24]} />
            </mesh>
            {/* Bagian atas peci oval melengkung rapi */}
            <mesh position={[0, 0.1, 0]} material={peciMat}>
              <sphereGeometry args={[0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            </mesh>
          </group>
        )}

        {/* Pilihan 2: JILBAB PUTIH POLOS (Anak SD Perempuan) */}
        {isGirl && (
          <group position={[0, 0.24, 0]}>
            {/* Tudung Kepala Jilbab Melengkung Anggun */}
            <mesh castShadow material={jilbabMat}>
              <sphereGeometry args={[0.34, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
            </mesh>
            {/* Draping / Juntai Kerudung Syar'i ke Pundak */}
            <mesh position={[0, -0.16, 0]} material={jilbabMat}>
              <cylinderGeometry args={[0.34, 0.44, 0.28, 24, 1, true]} />
            </mesh>
          </group>
        )}

        {/* Tas Punggung Anak SD di Belakang */}
        <mesh position={[0, 0.02, 0.3]} castShadow material={redMat}>
          <capsuleGeometry args={[0.13, 0.26, 12, 16]} />
        </mesh>
      </group>

      {/* 3. Tangan Mengapung Imut (Floating Mittens Putih Kemeja SD) */}
      <group position={[0, bodyCenterY, 0]} rotation-z={steerTilt * -0.15}>
        <mesh
          ref={leftHand}
          position={[-0.42 * finalScaleXZ, jumpArmY - armSwing * 0.15, -armSwing * 0.2]}
          castShadow
          material={shirtMat}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>

        <mesh
          ref={rightHand}
          position={[0.42 * finalScaleXZ, jumpArmY + armSwing * 0.15, armSwing * 0.2]}
          castShadow
          material={shirtMat}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
      </group>

      {/* 4. Kaki Mengapung Imut (Sepatu Hitam Siswa SD) */}
      {!isJumping && (
        <group position={[0, 0.1, 0]}>
          <mesh
            ref={leftFoot}
            position={[-0.16, THREE.MathUtils.lerp(0, -0.05, crouchT), -legSwing * 0.2]}
            castShadow
            material={beltMat}
          >
            <capsuleGeometry args={[0.075, 0.1, 8, 12]} />
          </mesh>
          <mesh
            ref={rightFoot}
            position={[0.16, THREE.MathUtils.lerp(0, -0.05, crouchT), legSwing * 0.2]}
            castShadow
            material={beltMat}
          >
            <capsuleGeometry args={[0.075, 0.1, 8, 12]} />
          </mesh>
        </group>
      )}

      {/* 5. Cincin Perisai Berpendar (Jika Memiliki Perisai Adab) */}
      {shields > 0 && (
        <group position={[0, bodyCenterY, 0]}>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.65, 0.025, 16, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation-y={Math.PI / 3}>
            <torusGeometry args={[0.62, 0.02, 16, 32]} />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {/* 6. Efek Kedipan Saat Kebal (Invulnerable) */}
      {invulnerable && (
        <mesh position={[0, bodyCenterY, 0]}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}
