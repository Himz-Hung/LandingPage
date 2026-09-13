import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getQuality } from './quality'

type Uniforms = {
  uBeat: { value: number }
  uBend: { value: number }
}

type Options = {
  group: React.RefObject<THREE.Group | null>
  progress: React.RefObject<number>
  uniforms: Uniforms
  /** Vị trí cá được ghi ra đây mỗi khung hình, để máy quay bám theo. */
  positionOut?: React.RefObject<THREE.Vector3>
}

/** Núm chỉnh dáng bơi và độ sâu. */
export const SWIM = {
  /** Độ sâu lúc bắt đầu, ngay dưới mặt nước. */
  startDepth: 2.5,
  /** Lặn sâu thêm bao nhiêu khi cuộn hết trang. */
  descent: 46,
  /** Bán kính đường xoáy lúc lặn. */
  radius: 3.4,
  /** Số vòng xoáy trên toàn trang. */
  turns: 2.4,
  /** Nghiêng người vào cua. */
  bankAmount: 1.4,
  /** Góc nghiêng tối đa, độ. */
  bankMax: 34,
  /** Trôi chậm khi người đọc dừng cuộn. */
  idleDrift: 0.01,
  /**
   * Vận tốc cuộn phải vượt ngưỡng này thì cá mới quay đầu.
   * Có ngưỡng để lúc cuộn lắt nhắt cá không giật qua giật lại.
   */
  reverseThreshold: 0.02,
}

const DEG = Math.PI / 180

/**
 * Cá lặn xuống sâu theo tiến độ cuộn.
 *
 * Đường đi là một đường xoáy trôn ốc đi xuống chứ không phải rơi thẳng.
 * Lý do không chỉ vì đẹp: nếu cá bơi thẳng đứng thì hướng bơi trùng với
 * phương thẳng đứng, và phép dựng hệ trục bằng tích có hướng sẽ suy biến
 * — cá sẽ giật xoay loạn quanh trục thân. Đường xoáy luôn có thành phần
 * ngang nên không bao giờ rơi vào trường hợp đó.
 *
 * Ba thứ làm nên dáng bơi thật:
 *   1. Nhịp lặn không đều, cá lượn rộng hẹp khác nhau từng đoạn
 *   2. Nghiêng người vào cua như máy bay, không bẻ ngang giữ bụng phẳng
 *   3. Lúc quẫy mạnh lúc buông trôi, không quạt đều như động cơ
 */
export function useSwimPath({ group, progress, uniforms, positionOut }: Options) {
  const pos = useMemo(() => new THREE.Vector3(), [])
  const ahead = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const prevDir = useMemo(() => new THREE.Vector3(0, -1, 0), [])
  const right = useMemo(() => new THREE.Vector3(), [])
  const up = useMemo(() => new THREE.Vector3(), [])
  const ref = useMemo(() => new THREE.Vector3(), [])
  const basis = useMemo(() => new THREE.Matrix4(), [])
  const quat = useMemo(() => new THREE.Quaternion(), [])
  const rollQuat = useMemo(() => new THREE.Quaternion(), [])

  const smoothed = useRef(0)
  const lastParam = useRef(0)
  const bank = useRef(0)
  const clock = useRef(0)
  const velocity = useRef(0)
  const heading = useRef(1)

  /** Đường xoáy trôn ốc đi xuống, bán kính phập phồng cho đỡ máy móc. */
  const pathAt = (p: number, out: THREE.Vector3) => {
    const angle = p * Math.PI * 2 * SWIM.turns
    // Bán kính dao động theo một tần số khác hẳn, nên vòng xoáy
    // lúc rộng lúc hẹp thay vì đều tăm tắp
    const radius =
      SWIM.radius *
      getQuality().radiusScale *
      (0.72 + 0.28 * Math.sin(p * Math.PI * 3.4 + 0.9))

    out.set(
      Math.cos(angle) * radius,
      -SWIM.startDepth - p * SWIM.descent + Math.sin(p * Math.PI * 5.1) * 0.5,
      Math.sin(angle) * radius * 0.72,
    )
    return out
  }

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) // chặn bước nhảy khi tab vừa hiện lại
    clock.current += dt

    const target = progress.current ?? 0
    smoothed.current += (target - smoothed.current) * Math.min(1, dt * 2.0)

    const param = smoothed.current + clock.current * SWIM.idleDrift

    // Vận tốc CÓ DẤU, lọc mượt để không nảy theo từng khung hình
    const rawVel = (param - lastParam.current) / Math.max(dt, 1e-4)
    lastParam.current = param
    velocity.current += (rawVel - velocity.current) * Math.min(1, dt * 5)

    // Chỉ đổi hướng khi vượt ngưỡng; dưới ngưỡng thì giữ nguyên hướng cũ,
    // nếu không cá sẽ rung lắc mỗi lần người đọc dừng tay giữa chừng.
    if (velocity.current > SWIM.reverseThreshold) heading.current = 1
    else if (velocity.current < -SWIM.reverseThreshold) heading.current = -1

    const speed = Math.abs(velocity.current)

    // Lúc bung lúc thả: hai tần số lệch nhau nên không rơi vào chu kỳ đều
    const burst =
      0.5 * Math.sin(clock.current * 0.37) + 0.32 * Math.sin(clock.current * 0.91 + 1.3)
    const beatTarget = 2.0 + burst + Math.min(speed * 5.0, 3.0)
    uniforms.uBeat.value += (beatTarget - uniforms.uBeat.value) * Math.min(1, dt * 1.6)

    const node = group.current
    if (!node) return

    pathAt(param, pos)
    pathAt(param + 0.003, ahead)
    dir.subVectors(ahead, pos)
    if (dir.lengthSq() < 1e-10) return
    // Cuộn ngược thì đầu cá quay ngược lại. Phép nội suy quaternion bên dưới
    // lo phần quay 180 độ, nên cá lượn một vòng chứ không lật tức thì.
    dir.normalize().multiplyScalar(heading.current)

    node.position.copy(pos)
    positionOut?.current?.copy(pos)

    // Đổi hướng giữa hai khung hình, lấy dấu theo trục đứng để biết cua bên nào
    const turn = prevDir.clone().cross(dir).y / Math.max(dt, 1e-4)
    prevDir.copy(dir)

    const bankTarget = THREE.MathUtils.clamp(
      -turn * SWIM.bankAmount,
      -SWIM.bankMax * DEG,
      SWIM.bankMax * DEG,
    )
    bank.current += (bankTarget - bank.current) * Math.min(1, dt * 2.2)

    // Chọn trục tham chiếu ít trùng hướng bơi nhất. Cá đang chúc xuống
    // thì lấy trục ngang làm mốc, nếu vẫn lấy trục đứng sẽ suy biến.
    if (Math.abs(dir.y) > 0.9) ref.set(0, 0, 1)
    else ref.set(0, 1, 0)

    right.crossVectors(ref, dir).normalize()
    up.crossVectors(dir, right).normalize()
    basis.makeBasis(right, up, dir)
    quat.setFromRotationMatrix(basis)

    rollQuat.setFromAxisAngle(dir, bank.current)
    quat.premultiply(rollQuat)

    node.quaternion.slerp(quat, Math.min(1, dt * 3.0))

    // Thân cong về phía đang rẽ
    const lean = THREE.MathUtils.clamp(turn * 0.12, -0.3, 0.3)
    uniforms.uBend.value += (lean - uniforms.uBend.value) * Math.min(1, dt * 1.8)
  })
}
