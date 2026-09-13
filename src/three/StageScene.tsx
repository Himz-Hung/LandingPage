import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// three.js nằm sau import động nên chỉ tải khi qua được vòng kiểm tra bên dưới
const StageCanvas = lazy(() => import('./StageCanvas'))

/**
 * Một cảnh WebGL duy nhất nằm cố định sau toàn bộ trang.
 * Tiến độ cuộn của cả trang điều khiển đường bơi của cá, nhờ vậy chuyển động
 * liền mạch theo mạch đọc thay vì mỗi section một canvas rời rạc.
 */
export function StageScene() {
  const progress = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    if (reduced || small || navigator.hardwareConcurrency <= 4) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    // Tab bị ẩn thì dừng hẳn vòng lặp, không đốt GPU trong nền
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Suspense fallback={null}>
        <StageCanvas progress={progress} visible={visible} />
      </Suspense>
    </div>
  )
}
