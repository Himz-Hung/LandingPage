import { motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { services } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

export function Services() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="services" className="shell py-24 md:py-36">
      <SectionHeader eyebrow={services.eyebrow} title={services.title} />

      <div className="mt-16 border-t border-line">
        {services.items.map((item, i) => (
          <Reveal key={item.no} delay={i * 0.06}>
            <div
              className="group relative border-b border-line py-8 md:py-10"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {/* Nền trượt sang phải khi rê chuột */}
              <motion.div
                className="absolute inset-0 -mx-5 bg-surface md:-mx-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active === i ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                style={{ originX: 0 }}
              />

              <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-baseline gap-6">
                  <span className="font-display text-sm font-medium text-muted">
                    {item.no}
                  </span>
                  <motion.h3
                    className="text-3xl font-semibold md:text-5xl"
                    animate={{ x: active === i ? 12 : 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  >
                    {item.title}
                  </motion.h3>
                </div>

                <div className="flex items-center gap-8 md:max-w-sm">
                  <p className="text-sm leading-relaxed text-ink-2">{item.body}</p>
                  <motion.span
                    className="hidden text-xl md:block"
                    animate={{
                      rotate: active === i ? 45 : 0,
                      color: active === i ? 'var(--color-accent)' : 'var(--color-muted)',
                    }}
                    transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  >
                    ↗
                  </motion.span>
                </div>
              </div>

              <div className="relative mt-5 flex flex-wrap gap-2 md:ml-[3.25rem]">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
