import { animate, useInView, useMotionValue, useTransform, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

type Props = {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

/** Số đếm lên khi khối lọt vào viewport. */
export function Counter({ to, suffix = '', duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  const count = useMotionValue(0)
  // Giữ đúng số chữ số thập phân của giá trị đích, nếu không 1.2 bị làm tròn thành 1
  const decimals = (String(to).split('.')[1] ?? '').length
  const text = useTransform(count, (v) =>
    v.toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [inView, to, duration, count])

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  )
}
