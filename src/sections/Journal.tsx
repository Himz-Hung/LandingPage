import { motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { journal } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

export function Journal() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="journal" className="shell py-24 md:py-36">
      <SectionHeader eyebrow="Tin tức" title="Ghi chép từ hiện trường." />

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {journal.map((post, i) => (
          <Reveal key={post.title} delay={i * 0.1}>
            <a
              href="#journal"
              data-cursor="Đọc"
              className="group block"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative aspect-16/11 overflow-hidden rounded-2xl bg-surface">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  animate={{ scale: hovered === i ? 1.07 : 1 }}
                  transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                />
              </div>

              <div className="mt-5 flex items-center gap-3 text-xs text-muted">
                <span>{post.date}</span>
                <span className="h-1 w-1 rounded-full bg-line" />
                <span>{post.readTime}</span>
              </div>

              <h3 className="mt-3 text-xl leading-snug font-semibold">
                <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {post.title}
                </span>
              </h3>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
