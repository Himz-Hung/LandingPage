import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { useRef, useState } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { journal, works } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

const rows = [
  ...works.map((w) => ({ title: w.title, meta: w.category, image: w.image })),
  ...journal.slice(0, 2).map((p) => ({
    title: p.title,
    meta: 'Tin tức',
    image: p.image,
  })),
]

/**
 * Danh sách kiểu index: rê vào dòng nào thì ảnh của dòng đó hiện ra bám theo chuột,
 * kèm độ nghiêng tính từ vận tốc di chuyển ngang.
 */
export function HoverList() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 260, damping: 28, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 260, damping: 28, mass: 0.5 })

  // Ảnh nghiêng theo chênh lệch giữa vị trí thật và vị trí lò xo đuổi theo.
  const rotate = useTransform(
    [mouseX, springX],
    ([target, current]: number[]) =>
      Math.max(-14, Math.min(14, (target - current) * 0.12)),
  )

  const handleMove = (event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  return (
    <section className="shell py-24 md:py-36">
      <SectionHeader
        eyebrow="Danh mục chương trình"
        title="Rê chuột để xem trước."
        body="Toàn bộ chương trình và bài viết, xem nhanh trước khi mở chi tiết."
      />

      <div
        ref={containerRef}
        className="relative mt-16"
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(null)}
      >
        <div className="border-t border-line">
          {rows.map((row, i) => (
            <div
              key={`${row.title}-${i}`}
              className="border-b border-line"
              onMouseEnter={() => setActive(i)}
            >
              <a
                href="#work"
                className="group flex items-center justify-between gap-6 py-6 md:py-8"
              >
                <motion.h3
                  className="text-2xl font-semibold md:text-4xl"
                  animate={{
                    x: active === i ? 20 : 0,
                    opacity: active === null || active === i ? 1 : 0.32,
                  }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                >
                  {row.title}
                </motion.h3>

                <motion.span
                  className="shrink-0 text-sm text-muted"
                  animate={{
                    x: active === i ? -20 : 0,
                    opacity: active === null || active === i ? 1 : 0.32,
                  }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                >
                  {row.meta}
                </motion.span>
              </a>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="preview"
              className="pointer-events-none absolute top-0 left-0 z-10 hidden aspect-4/5 w-64 overflow-hidden rounded-xl md:block"
              style={{
                x: springX,
                y: springY,
                rotate,
                translateX: '-50%',
                translateY: '-50%',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            >
              <img
                src={rows[active].image}
                alt=""
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
