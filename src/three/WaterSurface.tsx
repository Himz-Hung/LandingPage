import { useFBO } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { getQuality } from './quality'
import { FULLSCREEN_VERT, RIPPLE_COMPOSITE, RIPPLE_SIM } from './ripple'
import { useThemeColors } from './useThemeColors'

const SIM_SIZE = getQuality().simSize

/**
 * Biến cả trang thành một mặt hồ.
 *
 * Ba lượt vẽ mỗi khung hình:
 *   1. Chạy một bước mô phỏng sóng, chuột khuấy vào mặt nước
 *   2. Vẽ cảnh dưới nước (con cá) vào một kết cấu thay vì ra màn hình
 *   3. Vẽ kết cấu đó ra màn hình, bẻ toạ độ lấy mẫu theo độ dốc mặt nước
 *
 * Vì thế con cá thật sự bị nhìn XUYÊN QUA nước chứ không phải dán
 * một lớp gợn sóng lên trên.
 */
export function WaterSurface({ children }: { children: ReactNode }) {
  const { gl, size, viewport, camera } = useThree()
  const colors = useThemeColors()

  // Cảnh dưới nước sống trong scene riêng để vẽ vào kết cấu được
  const underwater = useMemo(() => new THREE.Scene(), [])

  const fboOptions = useMemo(
    () => ({
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    }),
    [],
  )

  // Hai kết cấu đổi vai trò cho nhau: GPU không cho vừa đọc vừa ghi một kết cấu
  const simA = useFBO(SIM_SIZE, SIM_SIZE, fboOptions)
  const simB = useFBO(SIM_SIZE, SIM_SIZE, fboOptions)
  const read = useRef(simA)
  const write = useRef(simB)

  const sceneTarget = useFBO({
    depthBuffer: true,
    stencilBuffer: false,
    samples: 0,
  })

  const quadCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const quadGeometry = useMemo(() => new THREE.PlaneGeometry(2, 2), [])

  const simMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: RIPPLE_SIM,
        uniforms: {
          uPrev: { value: null },
          uTexel: { value: new THREE.Vector2(1 / SIM_SIZE, 1 / SIM_SIZE) },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uMousePrev: { value: new THREE.Vector2(0.5, 0.5) },
          uStrength: { value: 0 },
          uRadius: { value: 0.035 },
          uDamping: { value: 0.975 },
          uAspect: { value: 1 },
          uTime: { value: 0 },
        },
      }),
    [],
  )

  const compositeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: RIPPLE_COMPOSITE,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uScene: { value: null },
          uRipple: { value: null },
          uTexel: { value: new THREE.Vector2(1 / SIM_SIZE, 1 / SIM_SIZE) },
          uRefract: { value: 0.42 },
          uSpecular: { value: 0.5 },
          uTint: { value: new THREE.Color('#c93a12') },
        },
      }),
    [],
  )

  const simScene = useMemo(() => {
    const scene = new THREE.Scene()
    scene.add(new THREE.Mesh(quadGeometry, simMaterial))
    return scene
  }, [quadGeometry, simMaterial])

  const compositeScene = useMemo(() => {
    const scene = new THREE.Scene()
    scene.add(new THREE.Mesh(quadGeometry, compositeMaterial))
    return scene
  }, [quadGeometry, compositeMaterial])

  useEffect(() => {
    compositeMaterial.uniforms.uTint.value.copy(colors.accent)
  }, [colors, compositeMaterial])

  useEffect(() => {
    simMaterial.uniforms.uAspect.value = size.width / size.height
  }, [size, simMaterial])

  // Vị trí chuột tính bằng toạ độ trang, không qua r3f, để vệt sóng
  // vẫn đúng chỗ kể cả khi canvas nằm dưới các lớp nội dung khác
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))
  const mousePrev = useRef(new THREE.Vector2(0.5, 0.5))
  const moved = useRef(0)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth
      const y = 1 - event.clientY / window.innerHeight
      const dx = x - mouse.current.x
      const dy = y - mouse.current.y
      moved.current = Math.min(1, Math.hypot(dx, dy) * 26)
      mouse.current.set(x, y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    return () => {
      quadGeometry.dispose()
      simMaterial.dispose()
      compositeMaterial.dispose()
    }
  }, [quadGeometry, simMaterial, compositeMaterial])

  // priority > 0 nên r3f ngừng tự vẽ, toàn bộ thứ tự do chỗ này quyết định
  useFrame((state, delta) => {
    const sim = simMaterial.uniforms

    sim.uTime.value += delta
    sim.uPrev.value = read.current.texture
    sim.uMousePrev.value.copy(mousePrev.current)
    sim.uMouse.value.copy(mouse.current)

    // Rê nhanh thì khuấy mạnh; đứng yên vẫn còn một chút cho mặt nước sống
    const target = 0.006 + moved.current * 0.055
    sim.uStrength.value += (target - sim.uStrength.value) * Math.min(1, delta * 12)
    moved.current *= 0.86
    mousePrev.current.copy(mouse.current)

    // 1. một bước sóng
    gl.setRenderTarget(write.current)
    gl.render(simScene, quadCamera)

    const swap = read.current
    read.current = write.current
    write.current = swap

    // 2. cảnh dưới nước vẽ vào kết cấu
    gl.setRenderTarget(sceneTarget)
    gl.setClearColor(0x000000, 0)
    gl.clear(true, true, false)
    gl.render(underwater, camera)

    // 3. ghép ra màn hình
    compositeMaterial.uniforms.uScene.value = sceneTarget.texture
    compositeMaterial.uniforms.uRipple.value = read.current.texture
    gl.setRenderTarget(null)
    gl.clear(true, true, false)
    gl.render(compositeScene, quadCamera)

    void state
    void viewport
  }, 1)

  return <>{createPortal(children, underwater)}</>
}
