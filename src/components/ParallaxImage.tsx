import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { EASE_OUT_EXPO } from '../lib/motion'

type Props = {
  src: string
  alt: string
  className?: string
  /** Ảnh trôi chậm hơn trang bao nhiêu phần trăm chiều cao. */
  amount?: number
  rounded?: string
}

/** Ảnh trôi lệch khi cuộn, kèm hiệu ứng phóng nhẹ lúc xuất hiện. */
export function ParallaxImage({
  src,
  alt,
  className = '',
  amount = 12,
  rounded = 'rounded-2xl',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden bg-surface ${rounded} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full scale-[1.25] object-cover"
        style={{ y }}
        initial={{ scale: 1.4 }}
        whileInView={{ scale: 1.25 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
      />
    </div>
  )
}
