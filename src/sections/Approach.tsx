import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { approach } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

export function Approach() {
  return (
    <section id="about" className="shell py-24 md:py-36">
      <SectionHeader eyebrow={approach.eyebrow} title={approach.title} />

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-3">
        {approach.steps.map((step, i) => (
          <Reveal key={step.no} delay={i * 0.1}>
            <div className="group h-full bg-canvas p-8 transition-colors duration-500 hover:bg-surface md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-sm font-medium text-accent">
                  {step.no}
                </span>
                <span className="font-display text-4xl font-semibold text-line transition-colors duration-500 group-hover:text-ink">
                  {step.weight}%
                </span>
              </div>

              {/* Thanh tiến độ chạy khi khối lọt vào màn hình */}
              <div className="mt-4 h-px w-full bg-line">
                <motion.div
                  className="h-px bg-accent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: step.weight / 100 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 + i * 0.1 }}
                  style={{ originX: 0 }}
                />
              </div>

              <h3 className="mt-10 text-2xl font-semibold">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-2">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
