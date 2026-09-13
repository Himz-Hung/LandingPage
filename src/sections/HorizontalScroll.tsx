import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { gallery, works } from '../data/site'

const cards = [...works, ...gallery.images.map((image, i) => ({
  title: `Khung hình ${i + 1}`,
  category: 'Nhiếp ảnh',
  year: '2026',
  image,
}))]

/**
 * Cuộn dọc nhưng nội dung chạy ngang.
 * Khối ngoài cao gấp nhiều lần màn hình; khối trong dính lại và dịch theo trục X.
 */
export function HorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Dịch vừa đủ để card cuối chạm mép phải màn hình.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-78%'])
  const labelX = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])

  return (
    <section
      ref={ref}
      data-contrast
      className="contrast-section contrast-veil relative h-[420vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="shell mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="eyebrow text-muted">Hậu trường</span>
            </div>
            <h2 className="mt-5 text-4xl font-semibold md:text-6xl">Trước giờ mở màn.</h2>
          </div>

          <motion.span
            className="hidden text-sm text-muted md:block"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          >
            Cuộn tiếp →
          </motion.span>
        </div>

        <motion.div style={{ x }} className="flex gap-6 px-5 will-change-transform md:px-10">
          {cards.map((card, i) => (
            <article
              key={`${card.title}-${i}`}
              className="group relative aspect-3/4 w-[70vw] shrink-0 overflow-hidden rounded-2xl bg-surface md:w-[28vw]"
            >
              <img
                src={card.image}
                alt={card.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Scrim lấy màu nền của chính section, nếu lấy màu chữ
                  thì trong theme sáng nó hoá ra lớp phủ trắng và mất chữ */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/85 to-transparent p-6">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-1 text-xs text-muted">{card.category}</p>
              </div>
            </article>
          ))}
        </motion.div>

        {/* Dòng chữ nền trôi ngược chiều, chậm hơn, tạo chiều sâu */}
        <motion.div
          style={{ x: labelX }}
          className="pointer-events-none mt-10 flex gap-16 whitespace-nowrap opacity-[0.07]"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-display text-[9vw] leading-none font-semibold">
              TẠ KHOA
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
