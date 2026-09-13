import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Koi } from './Koi'
import { GltfKoi, useKoiModel } from './KoiModel'
import { Water } from './Water'
import { WaterCeiling } from './WaterCeiling'
import { WaterSurface } from './WaterSurface'

type Props = {
  progress: React.RefObject<number>
  visible: boolean
}

type Follow = {
  target: React.RefObject<THREE.Vector3>
  depth: React.RefObject<number>
}

/**
 * Máy quay lặn theo cá.
 *
 * Bám bằng lò xo mềm chứ không dán cứng vào vị trí cá: nếu dán cứng thì
 * cá đứng yên trong khung hình và mất hẳn cảm giác đang đi xuống, còn bám
 * trễ một nhịp thì cá lúc dẫn trước lúc lùi lại, khung hình mới có nhịp thở.
 */
function CameraRig({ target, depth }: Follow) {
  const desired = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const smoothLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const fish = target.current
    if (!fish) return

    const below = Math.max(0, -fish.y)

    // Chuyển dần trong quãng lặn đầu tiên: lúc mới vào thì máy quay nhìn
    // NGANG MỰC NƯỚC để đường nước cắt ngang giữa khung hình trang đầu,
    // lặn sâu rồi mới hạ mắt xuống nhìn theo cá.
    const t = THREE.MathUtils.clamp(below / 14, 0, 1)

    const lift = THREE.MathUtils.lerp(1.2, 2.4, t)
    desired.set(fish.x * 0.35, fish.y + lift, fish.z * 0.35 + 8.2)
    state.camera.position.lerp(desired, Math.min(1, dt * 1.4))

    // Mực nước ở y = 0, nên nhìn vào 0 là đường nước rơi đúng giữa khung
    const lookY = THREE.MathUtils.lerp(0, fish.y - 1.2, t)
    look.set(fish.x * 0.5 * t, lookY, fish.z * 0.5 * t)
    smoothLook.current.lerp(look, Math.min(1, dt * 2.0))
    state.camera.lookAt(smoothLook.current)

    // Độ sâu dùng để làm tối dần mặt nước và cột nắng phía trên
    depth.current = below
  })

  return null
}

function KoiActor({
  progress,
  positionOut,
}: {
  progress: React.RefObject<number>
  positionOut: React.RefObject<THREE.Vector3>
}) {
  const status = useKoiModel()

  if (status === 'checking') return null
  if (status === 'missing') return <Koi progress={progress} positionOut={positionOut} />

  return (
    <Suspense fallback={<Koi progress={progress} positionOut={positionOut} />}>
      <GltfKoi progress={progress} positionOut={positionOut} />
    </Suspense>
  )
}

/** Phần nặng của cảnh nền: chỉ tải khi máy thật sự dựng WebGL. */
export default function StageCanvas({ progress, visible }: Props) {
  const koiPos = useRef(new THREE.Vector3(0, -3.2, 0))
  const depth = useRef(0)

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, -1.3, 8.2], fov: 48 }}
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
        <KoiActor progress={progress} positionOut={koiPos} />
        <CameraRig target={koiPos} depth={depth} />
      </WaterSurface>
    </Canvas>
  )
}
