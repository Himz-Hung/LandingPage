import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { BODY_LEN } from './koiGeometry'
import { useSwimPath } from './useSwimPath'

export const KOI_MODEL_URL = '/models/koi.glb'

/**
 * Bốn núm chỉnh cho model tải về.
 *
 * Hướng và tỉ lệ của model là thứ chỉ nhìn mới biết đúng hay sai, code đoán
 * được phần lớn nhưng không phải mọi lúc. Gom hết vào đây để chỉnh một chỗ,
 * đổi sang model khác cũng chỉ vặn bốn số này.
 */
const MODEL_TUNING = {
  /** Cá bơi lùi thì lật giá trị này. */
  flipForward: false,
  /** Cá lộn ngược thì để 180. Nằm nghiêng thì thử 90 hoặc -90. */
  rollDegrees: 0,
  /** Hệ số phóng to so với cỡ chuẩn. Lớn hơn 1 là to hơn. */
  scale: 3.2,
  /** Tốc độ phát animation quẫy đuôi. 1 là tốc độ gốc. */
  beatSpeed: 2.2,
  /**
   * Bật để vẽ mũi tên chỉ hướng mà code CHO RẰNG là đầu cá.
   * Mũi tên chọc ra từ mõm là đúng, chọc ra từ đuôi là phải lật flipForward.
   */
  debugAxes: false,
}

/**
 * Kiểm tra xem người dùng đã thả file model vào public/models chưa.
 * Không có thì trang vẫn chạy với con cá dựng bằng code, không vỡ gì.
 */
export function useKoiModel() {
  const [status, setStatus] = useState<'checking' | 'found' | 'missing'>('checking')

  useEffect(() => {
    let alive = true
    fetch(KOI_MODEL_URL, { method: 'HEAD' })
      .then((res) => {
        if (!alive) return
        // Dev server trả index.html cho đường dẫn không tồn tại,
        // nên phải soi thêm kiểu nội dung chứ không tin mỗi mã 200.
        const type = res.headers.get('content-type') ?? ''
        setStatus(res.ok && !type.includes('text/html') ? 'found' : 'missing')
      })
      .catch(() => alive && setStatus('missing'))
    return () => {
      alive = false
    }
  }, [])

  return status
}

/**
 * Đoạn GLSL bẻ đỉnh theo sóng, CHỈ dùng cho model không có animation sẵn.
 * Model có animation riêng mà còn chèn cái này thì uốn chồng lên uốn.
 */
const BEND_CHUNK = /* glsl */ `
  float t = clamp((position.z - uBounds.x) / max(uBounds.y - uBounds.x, 1e-4), 0.0, 1.0);
  t = 1.0 - t;

  float env = smoothstep(0.04, 1.0, t);
  env *= env;

  transformed.x += sin(t * 5.0 - uTime * uBeat) * 0.30 * env + uBend * t * t * 0.9;
  transformed.y += sin(t * 1.8 - uTime * 0.9) * 0.035 * env;
`

/**
 * Tìm trục dài nhất và xác định đầu cá nằm ở phía nào của trục đó.
 *
 * Mẹo nhận dạng: vây đuôi dẹt đứng nên lát cắt ở phía đuôi rất cao mà rất mỏng,
 * còn phía đầu thì cân đối. So tỉ lệ cao/dày ở hai đầu là biết ngay bên nào là đuôi.
 * Làm tự động thế này thì đổi sang model khác cũng không phải chỉnh tay.
 */
function detectAxis(root: THREE.Object3D) {
  const points: THREE.Vector3[] = []
  const temp = new THREE.Vector3()

  root.updateMatrixWorld(true)
  // Quy mọi đỉnh về hệ toạ độ của CHÍNH model.
  // Nếu dùng thẳng toạ độ thế giới thì phép xoay của đường bơi ở node cha
  // sẽ lẫn vào, và kết quả nhận diện đổi theo từng khung hình.
  const toLocal = new THREE.Matrix4().copy(root.matrixWorld).invert()

  root.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    const attr = mesh.geometry.getAttribute('position')
    if (!attr) return

    const step = Math.max(1, Math.floor(attr.count / 3000))
    for (let i = 0; i < attr.count; i += step) {
      temp.fromBufferAttribute(attr as THREE.BufferAttribute, i)
      temp.applyMatrix4(mesh.matrixWorld).applyMatrix4(toLocal)
      points.push(temp.clone())
    }
  })

  const fallback = {
    forward: new THREE.Vector3(0, 0, 1),
    up: new THREE.Vector3(0, 1, 0),
  }
  if (points.length < 8) return fallback

  const box = new THREE.Box3().setFromPoints(points)
  const size = box.getSize(new THREE.Vector3())
  const axes = ['x', 'y', 'z'] as const

  // Trục dài nhất là trục thân
  const long = axes.reduce((a, b) => (size[a] >= size[b] ? a : b))
  const rest = axes.filter((a) => a !== long)

  // Cá dẹp hai bên: chiều lưng–bụng luôn lớn hơn chiều ngang thân,
  // nên trong hai trục còn lại, trục nào trải rộng hơn là trục đứng.
  const up = size[rest[0]] >= size[rest[1]] ? rest[0] : rest[1]

  const lo = box.min[long]
  const hi = box.max[long]
  const band = (hi - lo) * 0.2

  // Vây đuôi dẹt đứng: lát cắt rất cao mà rất mỏng. So độ dẹt hai đầu
  // là biết đầu nào là đuôi.
  const flatness = (nearLow: boolean) => {
    const sel = points.filter((p) =>
      nearLow ? p[long] <= lo + band : p[long] >= hi - band,
    )
    if (sel.length < 3) return 0
    const spread = rest.map((a) => {
      const vals = sel.map((p) => p[a])
      return Math.max(...vals) - Math.min(...vals)
    })
    return Math.max(...spread) / Math.max(Math.min(...spread), 1e-6)
  }

  // Đuôi dẹt hơn, nên đầu ở phía còn lại
  const headAtHigh = flatness(true) > flatness(false)

  const forward = new THREE.Vector3()
  forward[long] = headAtHigh ? 1 : -1

  // Chiều lưng suy từ TRỌNG TÂM đám đỉnh, không phải trung điểm hộp bao:
  // trung điểm hộp luôn cách đều hai mép nên so sánh với nó vô nghĩa.
  // Vây lưng mỏng nhô cao còn thân dày nằm dưới, nên trọng tâm lệch về phía bụng.
  let sum = 0
  for (const pt of points) sum += pt[up]
  const centroid = sum / points.length

  const upVec = new THREE.Vector3()
  upVec[up] = box.max[up] - centroid >= centroid - box.min[up] ? 1 : -1

  return { forward, up: upVec }
}

type Uniforms = {
  uTime: { value: number }
  uBeat: { value: number }
  uBend: { value: number }
}

export function GltfKoi({
  progress,
  positionOut,
}: {
  progress: React.RefObject<number>
  positionOut?: React.RefObject<THREE.Vector3>
}) {
  const gltf = useGLTF(KOI_MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)

  const uniforms = useMemo<Uniforms>(
    () => ({ uTime: { value: 0 }, uBeat: { value: 2.6 }, uBend: { value: 0 } }),
    [],
  )

  // Bản sao riêng để không đụng vào cache dùng chung của useGLTF
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  const { actions, names } = useAnimations(gltf.animations, inner)
  const hasClips = gltf.animations.length > 0

  useEffect(() => {
    if (!names.length) return
    // Model này uốn mình bằng morph target, cứ để nó tự chạy vòng lặp
    const action = actions[names[0]]
    action
      ?.reset()
      .setLoop(THREE.LoopRepeat, Infinity)
      .setEffectiveTimeScale(MODEL_TUNING.beatSpeed)
      .play()
    return () => {
      action?.stop()
    }
  }, [actions, names])

  /**
   * Chuẩn hoá model: xoay cho đầu quay về +Z, dời tâm về gốc, thu phóng
   * về đúng cỡ con cá dựng tay. Model tải trên mạng mỗi cái một hướng
   * một cỡ nên bước này là bắt buộc.
   */
  useEffect(() => {
    if (!inner.current) return
    const holder = inner.current

    holder.quaternion.identity()
    holder.scale.setScalar(1)
    holder.position.set(0, 0, 0)

    const detected = detectAxis(model)

    const forward = detected.forward.clone()
    if (MODEL_TUNING.flipForward) forward.negate()
    const up = detected.up.clone()

    // Dựng hệ trục trực chuẩn từ hướng đầu và hướng lưng.
    // setFromUnitVectors chỉ quay cung ngắn nhất nên không giữ được
    // chiều trên–dưới, cá hay bị lật bụng. Dựng đủ ba trục thì hết.
    const right = new THREE.Vector3().crossVectors(up, forward).normalize()
    const trueUp = new THREE.Vector3().crossVectors(forward, right).normalize()

    // Ma trận này đưa +X,+Y,+Z sang right,trueUp,forward — ta cần chiều
    // ngược lại, mà hệ trực chuẩn thì nghịch đảo chính là chuyển vị.
    const basis = new THREE.Matrix4().makeBasis(right, trueUp, forward).transpose()

    const roll = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(MODEL_TUNING.rollDegrees),
    )

    holder.quaternion.setFromRotationMatrix(basis).premultiply(roll)
    holder.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(holder)
    const size = box.getSize(new THREE.Vector3())

    holder.scale.setScalar((BODY_LEN / Math.max(size.z, 1e-4)) * MODEL_TUNING.scale)
    holder.updateMatrixWorld(true)

    // Căn tâm SAU khi thu phóng: làm trước thì tâm lệch theo đúng tỉ lệ phóng
    const centered = new THREE.Box3().setFromObject(holder)
    const center = centered.getCenter(new THREE.Vector3())
    holder.position.sub(center)
  }, [model])

  // Chỉ chèn sóng khi model KHÔNG tự animate
  useEffect(() => {
    if (hasClips) return

    const box = new THREE.Box3().setFromObject(model)
    const bounds = new THREE.Vector2(box.min.z, box.max.z)

    model.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

      list.forEach((mat) => {
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = uniforms.uTime
          shader.uniforms.uBeat = uniforms.uBeat
          shader.uniforms.uBend = uniforms.uBend
          shader.uniforms.uBounds = { value: bounds }

          shader.vertexShader = shader.vertexShader
            .replace(
              '#include <common>',
              '#include <common>\nuniform float uTime;\nuniform float uBeat;\nuniform float uBend;\nuniform vec2 uBounds;',
            )
            .replace('#include <begin_vertex>', `#include <begin_vertex>\n${BEND_CHUNK}`)
        }
        mat.needsUpdate = true
      })
    })
  }, [model, hasClips, uniforms])

  useSwimPath({ group, progress, uniforms, positionOut })

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
  })

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive object={model} />
      </group>

      {/* Sau chuẩn hoá, +Z là hướng code cho là đầu cá. Mũi tên vẽ ở group
          ngoài nên nó chỉ đúng hướng bơi thật sự dùng để quay thân. */}
      {MODEL_TUNING.debugAxes && (
        <>
          <arrowHelper args={[
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            4,
            0x00ff66,
            1,
            0.5,
          ]} />
          <axesHelper args={[2.5]} />
        </>
      )}
    </group>
  )
}
