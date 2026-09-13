import { motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { works } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

export function Work() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="work" className="shell py-24 md:py-36">
      <SectionHeader
        eyebrow="Chương trình tiêu biểu"
        title="Những đêm đã sáng đèn."
        body="Bấm vào từng chương trình để xem quy mô, hạng mục thi công và kết quả."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
        {works.map((work, i) => (
          <Reveal key={work.title} delay={(i % 2) * 0.1}>
            <a
              href="#work"
              data-cursor="Xem"
              className={`group block ${i % 2 === 1 ? 'md:mt-20' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface">
                <motion.img
                  src={work.image}
                  alt={work.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  animate={{ scale: hovered === i ? 1.06 : 1 }}
                  transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                />

                {/* Lớp phủ tối dần khi rê chuột */}
                <motion.div
                  className="absolute inset-0 bg-ink"
                  animate={{ opacity: hovered === i ? 0.12 : 0 }}
                  transition={{ duration: 0.5 }}
                />

                <motion.span
                  className="absolute top-5 right-5 rounded-full bg-canvas px-4 py-2 text-xs font-medium"
                  animate={{
                    opacity: hovered === i ? 1 : 0,
                    y: hovered === i ? 0 : -8,
                  }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                >
                  {work.year}
                </motion.span>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold">{work.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{work.category}</p>
                </div>
                <motion.span
                  className="mt-1 text-xl"
                  animate={{
                    x: hovered === i ? 4 : 0,
                    y: hovered === i ? -4 : 0,
                    color: hovered === i ? 'var(--color-accent)' : 'var(--color-ink)',
                  }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                >
                  ↗
                </motion.span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-20 flex justify-center">
          <a
            href="#work"
            className="group flex items-center gap-3 rounded-full border border-line px-7 py-4 text-sm font-medium transition-colors duration-300 hover:border-ink"
          >
            Xem toàn bộ portfolio
            <span className="transition-transform duration-400 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </Reveal>
    </section>
  )
}
