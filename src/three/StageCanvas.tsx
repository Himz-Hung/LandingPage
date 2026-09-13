import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getQuality } from './quality'
import { Water } from './Water'
import { WaterCeiling } from './WaterCeiling'
import { WaterSurface } from './WaterSurface'

type Props = {
  progress: React.RefObject<number>
  visible: boolean
}

/** Lặn sâu thêm bao nhiêu khi cuộn hết trang. */
const DESCENT = 34
/** Độ sâu lúc mới vào, ngay dưới mặt nước. */
const START_DEPTH = 1.3

/**
 * Máy quay tự lặn theo tiến độ cuộn.
 *
 * Bám bằng lò xo mềm chứ không gán thẳng độ sâu: cuộn bằng con lăn cho ra
 * những bước nhảy rời rạc, gán thẳng thì hình giật theo từng nấc.
 */
function CameraRig({
  progress,
  depth,
}: {
  progress: React.RefObject<number>
  depth: React.RefObject<number>
}) {
  const quality = getQuality()
  const look = useMemo(() => new THREE.Vector3(), [])
  const smoothLook = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const current = useRef(START_DEPTH)
  const clock = useRef(0)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    clock.current += dt

    const target = START_DEPTH + (progress.current ?? 0) * DESCENT
    current.current += (target - current.current) * Math.min(1, dt * 2.0)

    const y = -current.current
    const below = Math.max(0, current.current)

    // Trôi ngang rất nhẹ cho khung hình không đứng chết khi ngừng cuộn
    const driftX = Math.sin(clock.current * 0.18) * 0.7
    const driftZ = Math.cos(clock.current * 0.13) * 0.4

    state.camera.position.set(driftX, y, quality.camDistance + driftZ)

    // Lúc mới vào nhìn ngang mực nước để đường nước cắt giữa khung hình,
    // lặn sâu rồi mới hạ mắt nhìn thẳng về phía trước.
    const t = THREE.MathUtils.clamp(below / 14, 0, 1)
    look.set(driftX, THREE.MathUtils.lerp(0, y - 2.5, t), 0)
    smoothLook.lerp(look, Math.min(1, dt * 2.2))
    state.camera.lookAt(smoothLook)

    depth.current = below
  })

  return null
}

/** Phần nặng của cảnh nền: chỉ tải khi máy thật sự dựng WebGL. */
export default function StageCanvas({ progress, visible }: Props) {
  const depth = useRef(0)
  const quality = getQuality()

  return (
    <Canvas
      dpr={quality.dpr}
      camera={{ position: [0, -START_DEPTH, quality.camDistance], fov: quality.fov }}
      frameloop={visible ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      {/* Mọi thứ bên trong được vẽ vào kết cấu rồi nhìn xuyên qua mặt nước */}
      <WaterSurface>
        <ambientLight intensity={1.35} />
        <directionalLight position={[-3, 8, 4]} intensity={2.0} />
        <hemisphereLight args={['#cfe6f0', '#3a3428', 0.8]} />

        <WaterCeiling depth={depth} />
        <Water />
        <CameraRig progress={progress} depth={depth} />
      </WaterSurface>
    </Canvas>
  )
}
