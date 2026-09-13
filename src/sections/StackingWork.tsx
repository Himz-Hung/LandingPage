import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { usePageTransition } from '../components/PageTransition'
import { SectionHeader } from '../components/SectionHeader'
import { works } from '../data/site'

/**
 * Card dính lại ở đỉnh màn hình rồi chồng lên nhau.
 *
 * Card lùi ra sau KHÔNG được giảm opacity của chính nó: thẻ trong suốt thì
 * chữ của card phía sau xuyên qua, chồng lên nhau đọc không ra. Thay vào đó
 * thẻ giữ nguyên độ đục, và một lớp phủ BÊN TRONG đậm dần lên để tạo chiều sâu.
 */
function StackCard({
  index,
  total,
  work,
  progress,
}: {
  index: number
  total: number
  work: (typeof works)[number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const { go } = usePageTransition()
  const start = index / total
  const end = (index + 1) / total

  const scale = useTransform(progress, [start, end], [1, 0.88])
  const y = useTransform(progress, [start, end], [0, -40])
  // Lớp phủ, không phải opacity của thẻ
  const veil = useTransform(progress, [start, end], [0, 0.62])

  return (
    <div
      className="sticky flex justify-center"
      style={{ top: `${88 + index * 18}px` }}
    >
      <motion.article
        style={{ scale, y }}
        onClick={() => go(`/du-an/${work.slug}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            go(`/du-an/${work.slug}`)
          }
        }}
        data-cursor="Xem"
        className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-line bg-canvas shadow-[var(--shadow-card)] transition-colors duration-500 hover:border-ink"
      >
        {/* Phủ màu nền lên chính card khi nó lùi ra sau. Nằm trên nội dung
            nhưng trong lòng thẻ, nên không đụng tới card xếp phía dưới. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-canvas"
          style={{ opacity: veil }}
        />

        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-medium text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow">{work.year}</span>
            </div>

            <div>
              <h3 className="text-4xl leading-none font-semibold md:text-6xl">
                {work.title}
              </h3>
              <p className="mt-4 text-sm text-muted">{work.category}</p>
            </div>

            {/* Chỉ còn là phần nhìn: cú bấm do cả thẻ nhận */}
            <span className="flex w-fit items-center gap-3 rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
              Xem dự án
              <span className="transition-transform duration-400 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>

          <div className="relative aspect-4/3 overflow-hidden md:aspect-auto">
            <img
              src={work.image}
              alt={work.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export function StackingWork() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="work" className="shell py-24 md:py-36">
      <SectionHeader
        eyebrow="Chương trình tiêu biểu"
        title="Những đêm đã sáng đèn."
        body="Bốn chương trình gần đây, từ tiệc nội bộ tới đại nhạc hội mười hai nghìn khán giả."
      />

      <div ref={ref} className="relative mt-16 flex flex-col gap-6">
        {works.map((work, i) => (
          <StackCard
            key={work.title}
            index={i}
            total={works.length}
            work={work}
            progress={scrollYProgress}
          />
        ))}
        {/* Khoảng trống để card cuối có đường cuộn mà chốt lại */}
        <div className="h-[40vh]" />
      </div>
    </section>
  )
}
