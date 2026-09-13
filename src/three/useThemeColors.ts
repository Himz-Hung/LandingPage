import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from '../lib/theme'

const read = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new THREE.Color(value || fallback)
}

/**
 * Đọc màu thật từ biến CSS để shader dùng chung bảng màu với phần HTML.
 * Đọc lại mỗi khi đổi theme, nhờ vậy blob và hạt không lạc tông khi sang nền tối.
 */
export function useThemeColors() {
  const { mode } = useTheme()
  const [colors, setColors] = useState(() => ({
    ink: new THREE.Color('#16150f'),
    muted: new THREE.Color('#756f62'),
    accent: new THREE.Color('#c93a12'),
    canvas: new THREE.Color('#f6f4ef'),
    // Màu chữ nằm trên nền đảo — dùng cho scene đặt trong contrast-section
    onInvert: new THREE.Color('#f6f4ef'),
  }))

  useEffect(() => {
    setColors({
      ink: read('--c-ink', '#16150f'),
      muted: read('--c-muted', '#756f62'),
      accent: read('--c-accent', '#c93a12'),
      canvas: read('--c-canvas', '#f6f4ef'),
      onInvert: read('--c-on-invert', '#f6f4ef'),
    })
  }, [mode])

  return colors
}
