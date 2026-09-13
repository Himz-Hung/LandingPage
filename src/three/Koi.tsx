import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { NOISE_GLSL } from './glsl'
import { buildFin, buildKoiBody, SPINE_GLSL } from './koiGeometry'
import { useSwimPath } from './useSwimPath'
import { useThemeColors } from './useThemeColors'

/* ---------------------------------------------------------------- thân cá */

const bodyVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec2 vPattern;
varying float vT;

${SPINE_GLSL}

void main() {
  // position đóng gói: .xy = mặt cắt ngang, .z = vị trí dọc thân
  float t = position.z;
  vec2 ring = position.xy;

  vec3 P, T, R, U;
  spineFrame(t, uTime, P, T, R, U);

  vec3 offset = R * ring.x + U * ring.y;
  vec3 pos = P + offset;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  vNormal = normalize(normalMatrix * normalize(offset + vec3(1e-5)));
  vView = normalize(-mv.xyz);
  // Toạ độ hoa văn gắn theo thân, không trôi khi cá uốn mình
  vPattern = vec2(t, atan(ring.y, ring.x) / 6.2831853 + 0.5);
  vT = t;

  gl_Position = projectionMatrix * mv;
}
`

const bodyFragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uPatch;
uniform vec3 uDeep;
uniform float uTime;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vView;
varying vec2 vPattern;
varying float vT;

${NOISE_GLSL}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);

  // Mảng đỏ cam trên nền trắng, sinh bằng noise rồi cắt ngưỡng
  // nên mỗi lần dựng lại cho một con cá có hoa văn khác nhau.
  float blob = fbm(vec3(vPattern.x * 3.4, vPattern.y * 2.2, 11.0), 4);
  float patch = smoothstep(0.02, 0.16, blob);

  // Vết ở đầu, đặc trưng của koi kohaku
  patch = max(patch, smoothstep(0.13, 0.05, vT) * 0.85);

  vec3 albedo = mix(uBase, uPatch, patch);

  // Lưng sẫm, bụng sáng — quy luật ngược sáng của cá
  float belly = smoothstep(-0.2, 0.9, N.y);
  albedo = mix(albedo * 0.62, albedo, 1.0 - belly * 0.55);
  albedo = mix(albedo, uDeep, smoothstep(0.35, 1.0, N.y) * 0.28);

  // Vảy: lưới ô chéo, hàng sau lệch nửa ô như vảy thật xếp so le.
  // Chỉ lấy phần rìa mỗi ô làm gân sáng, ruột vảy để nguyên.
  float row = vPattern.x * 46.0;
  float col = vPattern.y * 30.0 + mod(floor(row), 2.0) * 0.5;
  vec2 cell = vec2(fract(row), fract(col)) - 0.5;
  float scaleEdge = smoothstep(0.34, 0.5, max(abs(cell.x), abs(cell.y)));
  // Vảy nhỏ dần và mờ đi về phía đuôi với đầu
  float scaleMask = smoothstep(0.06, 0.2, vT) * smoothstep(0.95, 0.7, vT);
  albedo *= 1.0 - scaleEdge * 0.16 * scaleMask;

  // Nắp mang: một đường cong sẫm ngay sau đầu
  float gill = smoothstep(0.012, 0.0, abs(vT - 0.155));
  albedo *= 1.0 - gill * 0.3;

  vec3 L = normalize(vec3(-0.35, 0.9, 0.45));
  float diff = clamp(dot(N, L), 0.0, 1.0);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

  // Vân sáng gợn như nắng rọi qua mặt nước
  float caustic = fbm(vec3(vPattern * 6.0, uTime * 0.35), 3) * 0.5 + 0.5;

  vec3 color = albedo * (0.42 + diff * 0.62 + caustic * 0.18);
  color += vec3(1.0) * fres * 0.35;

  // Hai mắt nằm đối xứng hai bên đầu. vPattern.y là góc quanh thân
  // nên 0.25 và 0.75 rơi đúng vào hai hông.
  float eyeSide = min(
    distance(vPattern, vec2(0.085, 0.25)),
    distance(vPattern, vec2(0.085, 0.75))
  );
  float eye = smoothstep(0.032, 0.014, eyeSide);
  color = mix(color, vec3(0.03, 0.028, 0.025), eye);
  // Chấm sáng phản chiếu cho mắt đỡ chết
  float glint = smoothstep(0.012, 0.004, min(
    distance(vPattern, vec2(0.078, 0.238)),
    distance(vPattern, vec2(0.078, 0.738))
  ));
  color = mix(color, vec3(0.95), glint * 0.85);

  gl_FragColor = vec4(color, uOpacity);
}
`

/* ----------------------------------------------------------------- vây cá */

/*
 * Một shader lo cả ba loại vây, phân biệt bằng uMode:
 *   0 — đuôi     : nằm trong mặt phẳng đứng, nối dài quá gốc đuôi
 *   1 — vây lưng : dựng đứng trên sống lưng
 *   2 — vây ngực : xoè sang hai bên, uSide quyết định trái hay phải
 *
 * Mọi vây đều gọi spineFrame nên chúng đu đưa khớp với thân,
 * chỉ trễ pha một nhịp để trông như bị nước kéo lại.
 */
const finVertex = /* glsl */ `
uniform float uMode;
uniform float uSide;
uniform vec2 uSpan;      // khoảng t mà vây bám vào
uniform vec2 uWidth;     // bản vây ở gốc và ở ngọn
uniform float uLag;      // độ trễ pha so với thân

varying vec2 vUv;
varying float vFlow;

${SPINE_GLSL}

void main() {
  float u = position.x;
  float v = position.y;

  float t = mix(uSpan.x, uSpan.y, u);

  vec3 P, T, R, U;
  spineFrame(t, uTime - uLag, P, T, R, U);

  // Bản vây thon dần về ngọn theo đường cong mềm
  float w = mix(uWidth.x, uWidth.y, pow(u, 0.75));

  // Vây mềm nên ngọn bị nước kéo dao động chậm hơn thân
  float flutter = sin(u * 3.4 - uTime * uBeat * 0.85) * u * u * 0.16;

  vec3 pos;
  if (uMode < 0.5) {
    // Đuôi: trải theo chiều đứng, ngọn vẫy ngang
    pos = P + U * (v * w) + R * flutter;
  } else if (uMode < 1.5) {
    // Vây lưng: chỉ nhô lên phía trên sống lưng
    float vv = v * 0.5 + 0.5;
    pos = P + U * (0.04 + vv * w) + R * flutter * 0.5;
  } else if (uMode < 2.5) {
    // Vây ngực: bung sang bên rồi ngả về sau
    vec3 dir = normalize(R * uSide * 1.0 - T * 0.55);
    pos = P + dir * (0.09 + u * 0.42) + U * (v * w - 0.05) + U * flutter;
  } else {
    // Râu: hai sợi mềm buông từ mép, cong xuống và đu đưa mạnh hơn vây
    vec3 dir = normalize(R * uSide * 0.55 + T * 0.8);
    pos = P + dir * (0.04 + u * 0.34)
            + U * (v * w - 0.06 - u * u * 0.16)
            + R * flutter * 1.6;
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  vUv = vec2(u, v);
  vFlow = u;

  gl_Position = projectionMatrix * mv;
}
`

const finFragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uPatch;
uniform float uOpacity;

varying vec2 vUv;
varying float vFlow;

void main() {
  // Bản vây mỏng dần rồi tan ra ở ngọn
  float edge = 1.0 - abs(vUv.y);
  float alpha = smoothstep(0.0, 0.35, edge) * (1.0 - smoothstep(0.45, 1.0, vFlow));

  // Các tia vây chạy dọc bản
  float rays = 0.72 + 0.28 * sin(vUv.y * 26.0);

  vec3 color = mix(uPatch, uBase, smoothstep(0.0, 0.6, vFlow)) * rays;

  gl_FragColor = vec4(color, alpha * uOpacity);
}
`

/* --------------------------------------------------------------- component */

type FinConfig = {
  mode: number
  side: number
  span: [number, number]
  width: [number, number]
  lag: number
}

const FINS: FinConfig[] = [
  // Đuôi dài buông kiểu koi bướm
  { mode: 0, side: 1, span: [0.84, 1.62], width: [0.1, 0.46], lag: 0.16 },
  // Vây lưng chạy dọc sống lưng
  { mode: 1, side: 1, span: [0.24, 0.66], width: [0.16, 0.05], lag: 0.06 },
  // Hai vây ngực
  { mode: 2, side: 1, span: [0.19, 0.3], width: [0.1, 0.2], lag: 0.1 },
  { mode: 2, side: -1, span: [0.19, 0.3], width: [0.1, 0.2], lag: 0.1 },
  // Hai sợi râu ở mép, thứ khiến người xem nhận ra ngay là cá chép
  { mode: 3, side: 1, span: [0.03, 0.06], width: [0.012, 0.004], lag: 0.22 },
  { mode: 3, side: -1, span: [0.03, 0.06], width: [0.012, 0.004], lag: 0.22 },
]

type Props = {
  progress: React.RefObject<number>
  positionOut?: React.RefObject<THREE.Vector3>
}

export function Koi({ progress, positionOut }: Props) {
  const group = useRef<THREE.Group>(null)
  const bodyMat = useRef<THREE.ShaderMaterial>(null)
  const finMats = useRef<(THREE.ShaderMaterial | null)[]>([])

  const bodyGeo = useMemo(() => buildKoiBody(), [])
  const finGeo = useMemo(() => buildFin(), [])

  const colors = useThemeColors()

  const shared = useMemo(
    () => ({
      uTime: { value: 0 },
      uBeat: { value: 2.6 },
      uBend: { value: 0 },
    }),
    [],
  )

  const bodyUniforms = useMemo(
    () => ({
      ...shared,
      uBase: { value: new THREE.Color('#f6f4ef') },
      uPatch: { value: new THREE.Color('#c93a12') },
      uDeep: { value: new THREE.Color('#16150f') },
      uOpacity: { value: 1 },
    }),
    [shared],
  )

  // Mỗi vây cần uniform riêng cho hình dáng nhưng dùng chung nhịp quẫy
  const finUniforms = useMemo(
    () =>
      FINS.map((fin) => ({
        ...shared,
        uMode: { value: fin.mode },
        uSide: { value: fin.side },
        uSpan: { value: new THREE.Vector2(...fin.span) },
        uWidth: { value: new THREE.Vector2(...fin.width) },
        uLag: { value: fin.lag },
        uBase: { value: new THREE.Color('#f6f4ef') },
        uPatch: { value: new THREE.Color('#c93a12') },
        uOpacity: { value: 0.62 },
      })),
    [shared],
  )

  useEffect(() => {
    bodyUniforms.uBase.value.copy(colors.canvas)
    bodyUniforms.uPatch.value.copy(colors.accent)
    bodyUniforms.uDeep.value.copy(colors.ink)
    finUniforms.forEach((u) => {
      u.uBase.value.copy(colors.canvas)
      u.uPatch.value.copy(colors.accent)
    })
  }, [colors, bodyUniforms, finUniforms])

  // Đường bơi dùng chung với cá tải từ model, xem useSwimPath
  useSwimPath({ group, progress, uniforms: shared, positionOut })

  useFrame((_, delta) => {
    shared.uTime.value += delta
  })

  return (
    <group ref={group}>
      <mesh geometry={bodyGeo} frustumCulled={false}>
        <shaderMaterial
          ref={bodyMat}
          vertexShader={bodyVertex}
          fragmentShader={bodyFragment}
          uniforms={bodyUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>

      {FINS.map((_, i) => (
        <mesh key={i} geometry={finGeo} frustumCulled={false}>
          <shaderMaterial
            ref={(el) => {
              finMats.current[i] = el
            }}
            vertexShader={finVertex}
            fragmentShader={finFragment}
            uniforms={finUniforms[i]}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
