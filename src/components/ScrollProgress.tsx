import { motion, useScroll, useSpring } from 'motion/react'
import { useOnContrast } from '../lib/SectionTheme'

/** Thanh tiến độ cuộn ở đỉnh trang, đổi màu theo nền section đang xem. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 36,
    restDelta: 0.001,
  })
  const onContrast = useOnContrast()

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
      style={{ scaleX }}
      animate={{
        backgroundColor: onContrast ? 'var(--c-on-invert)' : 'var(--c-accent)',
      }}
      transition={{ duration: 0.4 }}
    />
  )
}
