import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useThemeColors } from './useThemeColors'

/* ------------------------------------------------------- bụi lơ lửng trong nước */

const MOTES = 320

const moteVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;

attribute vec3 aSeed;

varying float vAlpha;

void main() {
  // Trôi lên rất chậm rồi quay vòng lại đáy
  float rise = fract(aSeed.y + uTime * 0.012 * (0.4 + aSeed.z));
  vec3 pos = vec3(
    (aSeed.x - 0.5) * 26.0,
    (rise - 0.5) * 16.0,
    (aSeed.z - 0.5) * 12.0 - 2.0
  );

  // Dao động ngang nhẹ cho khỏi rơi thẳng đuột
  pos.x += sin(uTime * 0.25 + aSeed.z * 9.0) * 0.4;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  // Mờ ở hai đầu vòng đời để không thấy hạt bật ra hay biến mất
  vAlpha = smoothstep(0.0, 0.15, rise) * (1.0 - smoothstep(0.85, 1.0, rise));

  gl_Position = projectionMatrix * mv;
  gl_PointSize = (6.0 + aSeed.x * 10.0) * uPixelRatio * (1.0 / -mv.z);
}
`

const moteFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;

varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha * uOpacity);
}
`

function Motes() {
  const group = useRef<THREE.Points>(null)
  const material = useRef<THREE.ShaderMaterial>(null)
  const colors = useThemeColors()

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(MOTES * 3)
    const seeds = new Float32Array(MOTES * 3)
    for (let i = 0; i < MOTES; i++) {
      seeds[i * 3] = Math.random()
      seeds[i * 3 + 1] = Math.random()
      seeds[i * 3 + 2] = Math.random()
    }
    return { positions, seeds }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color('#756f62') },
      uOpacity: { value: 0.5 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uColor.value.copy(colors.muted)
  }, [colors, uniforms])

  useFrame((state, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta
    // Bụi luôn vây quanh máy quay, nếu đứng yên một chỗ thì lặn sâu
    // vài chục đơn vị là bơi ra khỏi vùng có bụi, nước trông chết trơ.
    group.current?.position.set(
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
    )
  })

  return (
    <points ref={group} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={MOTES}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[seeds, 3]}
          count={MOTES}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={moteVertex}
        fragmentShader={moteFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

/** Bụi lơ lửng trong nước, cố ý để rất nhạt. */
export function Water() {
  return <Motes />
}
