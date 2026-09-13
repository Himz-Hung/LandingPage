import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useOnContrast } from '../lib/SectionTheme'

/**
 * Con trỏ tuỳ biến: một chấm bám sát chuột và một vòng tròn đuổi theo có độ trễ.
 * Thêm data-cursor="..." lên phần tử bất kỳ để đổi trạng thái khi hover.
 */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 180, damping: 20, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 180, damping: 20, mass: 0.5 })

  const [label, setLabel] = useState<string | null>(null)
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const onContrast = useOnContrast()

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    setEnabled(true)
    document.body.dataset.customCursor = 'true'

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        '[data-cursor], a, button',
      )
      if (!el) {
        setActive(false)
        setLabel(null)
        return
      }
      setActive(true)
      setLabel(el.dataset.cursor && el.dataset.cursor !== 'true' ? el.dataset.cursor : null)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      delete document.body.dataset.customCursor
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          backgroundColor: onContrast ? 'var(--c-on-invert)' : 'var(--c-ink)',
        }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full border text-[10px] font-medium tracking-widest uppercase"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: label ? 88 : active ? 52 : 32,
          height: label ? 88 : active ? 52 : 32,
          backgroundColor: label ? 'var(--c-accent)' : 'rgba(0,0,0,0)',
          // color-mix để viền mờ luôn bám đúng màu chữ của nền đang đứng
          borderColor: label
            ? 'var(--c-accent)'
            : onContrast
              ? 'color-mix(in oklab, var(--c-on-invert) 40%, transparent)'
              : 'color-mix(in oklab, var(--c-ink) 35%, transparent)',
          color: label ? 'var(--c-on-accent)' : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {label}
      </motion.div>
    </>
  )
}
