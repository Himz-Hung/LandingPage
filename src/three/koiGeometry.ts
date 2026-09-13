import * as THREE from 'three'

export const BODY_LEN = 2.6

/**
 * Hàm xương sống dùng chung cho thân và mọi vây.
 * Đây là mấu chốt khiến con cá trông sống: thân, đuôi, vây lưng và vây ngực
 * đều đọc CÙNG một hàm này, nên chúng luôn khớp nhau tuyệt đối.
 *
 * Sóng chạy dọc từ đầu xuống đuôi với biên độ tăng dần — đầu gần như giữ hướng,
 * đuôi quạt mạnh, đúng cách cá chép bơi. Nếu để biên độ đều thì cả con
 * sẽ lắc như cọng dây, không ra dáng cá.
 */
export const SPINE_GLSL = /* glsl */ `
uniform float uTime;
uniform float uBeat;   // nhịp quẫy, tăng khi cuộn nhanh
uniform float uBend;   // độ cong thân khi đổi hướng

vec3 spinePoint(float t, float time) {
  // t = 0 ở mõm, 1 ở gốc đuôi. Trục +Z là hướng bơi tới.
  float z = (0.5 - t) * ${BODY_LEN.toFixed(2)};

  // Biên độ bình phương theo t: đầu đứng yên, đuôi quạt rộng
  float env = smoothstep(0.04, 1.0, t);
  env *= env;

  float phase = t * 5.0 - time * uBeat;
  float x = sin(phase) * 0.30 * env;

  // Thân cong thêm khi cá đang lượn sang bên
  x += uBend * t * t * 0.9;

  // Nhấp nhô dọc rất nhẹ cho đỡ phẳng
  float y = sin(t * 1.8 - time * 0.9) * 0.035 * env;

  return vec3(x, y, z);
}

/**
 * Khung toạ độ tại một điểm trên xương sống, dựng bằng sai phân.
 * Có khung này thì mặt cắt ngang mới xoay theo thân, nếu chỉ dịch ngang
 * thì lúc thân uốn mạnh sẽ thấy bẹp và lòi cạnh.
 */
void spineFrame(float t, float time, out vec3 P, out vec3 T, out vec3 R, out vec3 U) {
  P = spinePoint(t, time);
  vec3 P2 = spinePoint(t + 0.012, time);
  T = normalize(P2 - P);
  R = normalize(cross(vec3(0.0, 1.0, 0.0), T) + vec3(1e-5));
  U = normalize(cross(T, R));
}
`

/** Bán kính ngang của thân tại vị trí t (0 = mõm, 1 = gốc đuôi). */
function radiusX(t: number) {
  if (t < 0.08) return 0.035 + (t / 0.08) * 0.105 // mõm phình dần
  if (t < 0.34) return 0.14 + Math.sin(((t - 0.08) / 0.26) * Math.PI) * 0.045
  return 0.155 * Math.pow(1 - (t - 0.34) / 0.66, 1.35) + 0.012 // thon về đuôi
}

/** Cá chép dẹp hai bên nên chiều cao lớn hơn chiều ngang. */
function radiusY(t: number) {
  const belly = t < 0.45 ? 1.5 : 1.5 - (t - 0.45) * 0.5
  return radiusX(t) * belly
}

/**
 * Thân cá dựng dạng ống: mỗi đốt là một mặt cắt elip.
 * position được đóng gói là (mặtCắtX, mặtCắtY, t) — shader sẽ đọc .z làm
 * vị trí dọc thân rồi tự đặt đỉnh vào khung toạ độ của xương sống.
 */
export function buildKoiBody(segments = 150, radial = 20) {
  const positions = new Float32Array((segments + 1) * (radial + 1) * 3)
  const indices: number[] = []

  let k = 0
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const rx = radiusX(t)
    const ry = radiusY(t)

    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2
      positions[k++] = Math.cos(a) * rx
      positions[k++] = Math.sin(a) * ry
      positions[k++] = t
    }
  }

  const stride = radial + 1
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * stride + j
      const b = a + stride
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  return geometry
}

/**
 * Dải phẳng dùng cho mọi loại vây.
 * position đóng gói là (u, v, 0): u chạy dọc vây, v chạy ngang bản vây.
 * Hình dáng cụ thể của từng vây do uniform trong shader quyết định,
 * nên ba loại vây dùng chung đúng một geometry.
 */
export function buildFin(uSeg = 40, vSeg = 12) {
  const positions = new Float32Array((uSeg + 1) * (vSeg + 1) * 3)
  const indices: number[] = []

  let k = 0
  for (let i = 0; i <= uSeg; i++) {
    for (let j = 0; j <= vSeg; j++) {
      positions[k++] = i / uSeg
      positions[k++] = (j / vSeg) * 2 - 1
      positions[k++] = 0
    }
  }

  const stride = vSeg + 1
  for (let i = 0; i < uSeg; i++) {
    for (let j = 0; j < vSeg; j++) {
      const a = i * stride + j
      const b = a + stride
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  return geometry
}
