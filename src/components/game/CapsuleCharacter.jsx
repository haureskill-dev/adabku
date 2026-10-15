import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

/**
 * Model Karakter Kapsul Edukasi SD Sederhana & Faceless (Sesuai Referensi Gambar).
 * 1) Anak SD Laki-laki:
 *    - Kapsul geometris bersih seragam SD (Kemeja Putih + Dasi Merah + Celana Merah + Kaos Kaki Putih + Sepatu Hitam).
 *    - Topi SD Merah-Putih di kepala dengan pet visor dan emblem emas.
 *    - Wajah polos warna kulit peach (Strictly Faceless, Syariat Compliant).
 * 2) Anak SD Perempuan:
 *    - Kapsul geometris seragam SD (Jilbab Putih Polos + Rok Rempel Merah SD + Kaos Kaki Putih + Sepatu Hitam).
 *    - Lambang/badge sekolah di dada.
 *    - Wajah oval polos peach (Strictly Faceless).
 * Bentuk kapsul disederhanakan tanpa bola tangan/kaki melayang agar rapi, proporsional, dan estetik.
 */
export default function CapsuleCharacter({
  gender: propGender, // 'boy' | 'girl' | 'laki-laki' | 'perempuan'
  color,
  accentColor,
  crouchT = 0,
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

  // Material Warna Sesuai Seragam SD Indonesia
  const materials = useMemo(() => {
    return {
      whiteShirt: new THREE.MeshStandardMaterial({
        color: color || '#ffffff',
        roughness: 0.35,
        metalness: 0.02,
      }),
      redFabric: new THREE.MeshStandardMaterial({
        color: accentColor || '#dc2626',
        roughness: 0.4,
        metalness: 0.02,
      }),
      darkRedFabric: new THREE.MeshStandardMaterial({
        color: '#b91c1c',
        roughness: 0.4,
        metalness: 0.02,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: '#fed7aa', // Peach skin tone polos (faceless)
        roughness: 0.45,
        metalness: 0.02,
      }),
      blackShoes: new THREE.MeshStandardMaterial({
        color: '#1e293b', // Sepatu hitam siswa SD
        roughness: 0.5,
        metalness: 0.1,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: '#292524', // Rambut gelap samping
        roughness: 0.8,
        metalness: 0.02,
      }),
      goldBadge: new THREE.MeshStandardMaterial({
        color: '#f59e0b', // Emblem Garuda / SD kuning emas
        roughness: 0.3,
        metalness: 0.4,
      }),
    }
  }, [color, accentColor])

  // Hitung deformasi squash, stretch & wobble animasi berjalan
  const bounce = isWalking && !isJumping ? Math.abs(Math.sin(runPhase * 2)) * 0.06 : 0
  const sideWobble = isWalking && !isJumping ? Math.sin(runPhase) * 0.06 : 0

  let targetScaleY = 1 + bounce
  let targetScaleXZ = 1 - bounce * 0.4

  if (isJumping) {
    targetScaleY = 1.18
    targetScaleXZ = 0.92
  }

  // Saat menunduk: tubuh memendek gepeng meluncur di lantai
  const finalScaleY = THREE.MathUtils.lerp(targetScaleY, 0.52, crouchT)
  const finalScaleXZ = THREE.MathUtils.lerp(targetScaleXZ, 1.38, crouchT)
  const bodyCenterY = THREE.MathUtils.lerp(0.66, 0.35, crouchT)

  return (
    <group ref={root}>
      {/* 1. Kontak bayangan bulat di lantai */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.02, 0]}
        scale={isJumping ? [0.65, 0.65, 1] : [finalScaleXZ * 0.88, finalScaleXZ * 0.88, 1]}
      >
        <circleGeometry args={[0.36, 24]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={isJumping ? 0.15 : 0.32} />
      </mesh>

      {/* 2. Tubuh Kapsul Tunggal Rapi (Sesuai Desain Referensi) */}
      <group
        ref={bodyGroup}
        position={[0, bodyCenterY, 0]}
        rotation-z={steerTilt * -0.22 + sideWobble}
        rotation-x={forwardTilt * 0.15}
        scale={[finalScaleXZ, finalScaleY, finalScaleXZ]}
      >
        {/* Kapsul Dasar (Bentuk Pill Sederhana) */}
        <mesh castShadow receiveShadow material={materials.whiteShirt}>
          <capsuleGeometry args={[0.31, 0.66, 24, 32]} />
        </mesh>

        {/* Sepatu Hitam di Bagian Bawah Kapsul */}
        <mesh position={[0, -0.37, 0]} material={materials.blackShoes}>
          <cylinderGeometry args={[0.305, 0.312, 0.18, 24]} />
        </mesh>
        <mesh position={[0, -0.47, 0]} material={materials.blackShoes}>
          <sphereGeometry args={[0.31, 24, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        </mesh>

        {/* Garis Kaus Kaki Putih */}
        <mesh position={[0, -0.27, 0]} material={materials.whiteShirt}>
          <cylinderGeometry args={[0.314, 0.314, 0.06, 24]} />
        </mesh>

        {/* ----------------- VARIAN ANAK LAKI-LAKI ----------------- */}
        {!isGirl && (
          <>
            {/* Celana Pendek Merah SD */}
            <mesh position={[0, -0.11, 0]} material={materials.redFabric}>
              <cylinderGeometry args={[0.316, 0.316, 0.28, 24]} />
            </mesh>
            {/* Garis Pemisah Celana Depan */}
            <mesh position={[0, -0.11, 0.31]}>
              <boxGeometry args={[0.015, 0.26, 0.02]} />
              <meshBasicMaterial color="#991b1b" />
            </mesh>

            {/* Baju Kemeja Putih SD */}
            <mesh position={[0, 0.13, 0]} material={materials.whiteShirt}>
              <cylinderGeometry args={[0.318, 0.318, 0.22, 24]} />
            </mesh>

            {/* Dasi Merah SD Segitiga Panjang di Dada */}
            <group position={[0, 0.12, 0.312]}>
              {/* Simpul Dasi Segitiga */}
              <mesh position={[0, 0.06, 0]} rotation-z={Math.PI}>
                <coneGeometry args={[0.035, 0.045, 3]} />
                <meshStandardMaterial color="#b91c1c" roughness={0.3} />
              </mesh>
              {/* Badan Dasi Merah Panjang */}
              <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[0.05, 0.14, 0.015]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
              </mesh>
              {/* Ujung Lancip Dasi */}
              <mesh position={[0, -0.12, 0]} rotation-z={Math.PI}>
                <coneGeometry args={[0.035, 0.04, 3]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
              </mesh>
            </group>

            {/* Wajah Peach Polos (100% Faceless) */}
            <mesh position={[0, 0.33, 0.04]} material={materials.skin}>
              <sphereGeometry args={[0.308, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            </mesh>

            {/* Rambut Gelap di Samping & Belakang Kepala */}
            <mesh position={[0, 0.34, -0.04]} material={materials.hair}>
              <cylinderGeometry args={[0.312, 0.316, 0.14, 24, 1, false, Math.PI * 0.25, Math.PI * 1.5]} />
            </mesh>

            {/* Topi SD Merah-Putih Khas Pelajar SD */}
            <group position={[0, 0.42, 0]}>
              {/* Bagian Mahkota Belakang & Atas (Merah) */}
              <mesh material={materials.redFabric}>
                <sphereGeometry args={[0.32, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
              </mesh>
              {/* Panel Depan Putih Khas Topi SD */}
              <mesh position={[0, -0.01, 0.08]} material={materials.whiteShirt}>
                <cylinderGeometry args={[0.318, 0.322, 0.12, 24, 1, false, -Math.PI * 0.28, Math.PI * 0.56]} />
              </mesh>
              {/* Pet / Visor Topi Merah Melengkung ke Depan */}
              <mesh position={[0, -0.06, 0.24]} rotation-x={0.25} material={materials.darkRedFabric}>
                <boxGeometry args={[0.34, 0.025, 0.14]} />
              </mesh>
              {/* Lambang Garuda / SD Kuning Emas di Panel Depan */}
              <mesh position={[0, 0.01, 0.32]} material={materials.goldBadge}>
                <boxGeometry args={[0.045, 0.05, 0.01]} />
              </mesh>
            </group>
          </>
        )}

        {/* ----------------- VARIAN ANAK PEREMPUAN ----------------- */}
        {isGirl && (
          <>
            {/* Rok Rempel / Lipit Merah SD */}
            <group position={[0, -0.1, 0]}>
              <mesh material={materials.redFabric}>
                <cylinderGeometry args={[0.318, 0.33, 0.34, 24]} />
              </mesh>
              {/* Aksen Garis Rempel / Lipit Vertikal Khas Rok SD */}
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2
                const rx = Math.sin(angle) * 0.326
                const rz = Math.cos(angle) * 0.326
                return (
                  <mesh key={i} position={[rx, 0, rz]} rotation-y={angle}>
                    <boxGeometry args={[0.015, 0.33, 0.01]} />
                    <meshBasicMaterial color="#991b1b" />
                  </mesh>
                )
              })}
            </group>

            {/* Baju / Jilbab Putih Bersih Menutupi Dada */}
            <mesh position={[0, 0.14, 0]} material={materials.whiteShirt}>
              <cylinderGeometry args={[0.322, 0.322, 0.2, 24]} />
            </mesh>

            {/* Badge / Lambang Sekolah di Dada Kiri */}
            <mesh position={[0.13, 0.14, 0.315]} material={materials.goldBadge}>
              <boxGeometry args={[0.045, 0.055, 0.01]} />
            </mesh>

            {/* Jilbab Putih Bersih Melingkupi Kepala */}
            <group position={[0, 0.38, 0]}>
              <mesh material={materials.whiteShirt}>
                <sphereGeometry args={[0.325, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
              </mesh>
            </group>

            {/* Bukaan Wajah Oval Peach (100% Faceless Sesuai Gambar) */}
            <mesh position={[0, 0.32, 0.11]} rotation-x={-0.08} material={materials.skin}>
              <sphereGeometry args={[0.23, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>
          </>
        )}
      </group>

      {/* 3. Cincin Perisai Berpendar (Jika Memiliki Perisai Adab) */}
      {shields > 0 && (
        <group position={[0, bodyCenterY, 0]}>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.55, 0.02, 16, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation-y={Math.PI / 3}>
            <torusGeometry args={[0.52, 0.018, 16, 32]} />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {/* 4. Efek Kedipan Saat Kebal (Invulnerable) */}
      {invulnerable && (
        <mesh position={[0, bodyCenterY, 0]}>
          <sphereGeometry args={[0.48, 16, 16]} />
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
