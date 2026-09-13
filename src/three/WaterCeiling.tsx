import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { NOISE_GLSL } from './glsl'
import { useThemeColors } from './useThemeColors'

/* ------------------------------------------------ mặt nước nhìn từ bên dưới */

const ceilingVertex = /* glsl */ `
varying vec2 vPos;
varying vec3 vWorld;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vPos = position.xy;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const ceilingFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uLight;
uniform vec3 uDeep;
uniform float uOpacity;
uniform float uCamDepth;

varying vec2 vPos;
varying vec3 vWorld;

${NOISE_GLSL}

void main() {
  vec2 p = vPos * 0.055;

  // Hai lớp vân trôi ngược nhau; chỗ chúng gần bằng nhau tạo thành
  // đường sáng mảnh — đúng kiểu vân nắng hắt lên mặt dưới của nước.
  float a = fbm(vec3(p, uTime * 0.08), 3);
  float b = fbm(vec3(p * 1.9 + 5.0, -uTime * 0.06), 3);
  float caustic = pow(clamp(1.0 - abs(a - b) * 3.0, 0.0, 1.0), 2.2);

  // Gợn nhỏ chồng lên cho mặt nước không bị mượt như nhựa
  float ripple = 0.5 + 0.5 * sin(vPos.x * 0.9 + uTime * 1.1)
                          * sin(vPos.y * 0.75 - uTime * 0.9);

  // Càng xa tâm càng mờ, để không nhìn thấy cạnh của tấm phẳng
  float dist = length(vPos);
  float fade = smoothstep(150.0, 20.0, dist);

  // Lặn càng sâu thì mặt nước phía trên càng tối và càng xa
  float depthFade = exp(-uCamDepth * 0.035);

  vec3 color = mix(uDeep, uLight, caustic * 0.85 + ripple * 0.15);
  float alpha = (caustic * 0.55 + 0.12) * fade * uOpacity * depthFade;

  gl_FragColor = vec4(color, alpha);
}
`

function Ceiling({ depth }: { depth: React.RefObject<number> }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const colors = useThemeColors()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLight: { value: new THREE.Color('#ffffff') },
      uDeep: { value: new THREE.Color('#c93a12') },
      uOpacity: { value: 0.9 },
      uCamDepth: { value: 0 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uLight.value.copy(colors.canvas)
    uniforms.uDeep.value.copy(colors.accent)
  }, [colors, uniforms])

  useFrame((_, delta) => {
    if (!material.current) return
    material.current.uniforms.uTime.value += delta
    material.current.uniforms.uCamDepth.value = depth.current ?? 0
  })

  return (
    // Xoay nằm ngang, mặt hướng xuống vì người xem đứng phía dưới
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[400, 400, 1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={ceilingVertex}
        fragmentShader={ceilingFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------- cột nắng rọi */

const shaftVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const shaftFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform float uSeed;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  // Mảnh dần về phía dưới và mờ dần theo chiều sâu
  float taper = 1.0 - smoothstep(0.0, 1.0, vUv.y);
  float edge = 1.0 - abs(vUv.x * 2.0 - 1.0);
  edge = pow(clamp(edge, 0.0, 1.0), 1.8);

  // Lay nhẹ theo thời gian cho cột nắng không đứng chết
  float sway = 0.85 + 0.15 * sin(uTime * 0.6 + uSeed * 7.0 + vUv.y * 2.0);

  gl_FragColor = vec4(uColor, edge * taper * sway * uOpacity);
}
`

const SHAFTS = [
  { x: -14, z: -8, w: 5.5, h: 34, rot: 0.16 },
  { x: 6, z: -14, w: 7.0, h: 40, rot: -0.1 },
  { x: 18, z: 4, w: 4.5, h: 30, rot: 0.2 },
  { x: -5, z: 10, w: 6.0, h: 36, rot: -0.18 },
]

function Shafts({ depth }: { depth: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([])
  const colors = useThemeColors()
  const { camera } = useThree()

  const uniforms = useMemo(
    () =>
      SHAFTS.map((_, i) => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uSeed: { value: i * 1.37 },
        uOpacity: { value: 0.16 },
      })),
    [],
  )

  useEffect(() => {
    uniforms.forEach((u) => u.uColor.value.copy(colors.canvas))
  }, [colors, uniforms])

  useFrame((_, delta) => {
    uniforms.forEach((u) => {
      u.uTime.value += delta
      // Xuống sâu thì nắng yếu dần
      u.uOpacity.value = 0.16 * Math.exp(-(depth.current ?? 0) * 0.045)
    })

    // Cột nắng luôn xoay mặt về phía máy quay, nếu không sẽ thấy nó mỏng như tờ giấy
    group.current?.children.forEach((child) => {
      child.rotation.y = Math.atan2(
        camera.position.x - child.position.x,
        camera.position.z - child.position.z,
      )
    })
  })

  return (
    <group ref={group}>
      {SHAFTS.map((s, i) => (
        <mesh key={i} position={[s.x, -s.h / 2, s.z]} frustumCulled={false}>
          <planeGeometry args={[s.w, s.h, 1, 1]} />
          <shaderMaterial
            ref={(el) => {
              mats.current[i] = el
            }}
            vertexShader={shaftVertex}
            fragmentShader={shaftFragment}
            uniforms={uniforms[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Mặt nước phía trên cùng cột nắng rọi xuống. */
export function WaterCeiling({ depth }: { depth: React.RefObject<number> }) {
  return (
    <>
      <Ceiling depth={depth} />
      <Shafts depth={depth} />
    </>
  )
}
