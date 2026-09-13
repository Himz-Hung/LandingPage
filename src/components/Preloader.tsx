import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { EASE_OUT_EXPO } from '../lib/motion'

type Props = {
  onDone: () => void
}

/** Màn chờ: số chạy 0 → 100 rồi cả tấm màn kéo lên để lộ trang. */
export function Preloader({ onDone }: Props) {
  const progress = useMotionValue(0)
  const rounded = useTransform(progress, (v) => Math.round(v).toString().padStart(3, '0'))
  const width = useTransform(progress, (v) => `${v}%`)

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
    })
    return controls.stop
  }, [progress])

  return (
    <motion.div
      className="contrast-section fixed inset-0 z-[90] flex flex-col justify-between px-5 py-8 md:px-10"
      initial={{ y: '0%' }}
      animate={{ y: '-101%' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 2.1 }}
      onAnimationComplete={onDone}
    >
      <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase">
        <span>Tạ Khoa</span>
        <span className="hidden md:inline">Đang tải</span>
      </div>

      <motion.span
        className="font-display text-[22vw] leading-none font-semibold md:text-[14vw]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <motion.span>{rounded}</motion.span>
      </motion.span>

      <div className="h-px w-full bg-line">
        <motion.div className="h-px bg-accent" style={{ width }} />
      </div>
    </motion.div>
  )
}
