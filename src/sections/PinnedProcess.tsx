import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react'
import { useRef, useState } from 'react'
import { approach } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

/**
 * Section đứng yên (pin) trong lúc cuộn, nội dung bên trong đổi theo tiến độ.
 * Chỉ số bước được tính từ scrollYProgress nên chuyển mượt theo thanh cuộn.
 */
export function PinnedProcess() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const [step, setStep] = useState(0)
  const total = approach.steps.length

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(total - 1, Math.floor(value * total))
    setStep(next)
  })

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="about" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="shell grid w-full gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="eyebrow">{approach.eyebrow}</span>
            </div>

            <h2 className="mt-6 text-4xl font-semibold md:text-6xl">{approach.title}</h2>

            {/* Thanh dọc chạy theo tiến độ cuộn của cả section */}
            <div className="mt-10 hidden h-40 w-px bg-line md:block">
              <motion.div
                className="h-full w-px origin-top bg-accent"
                style={{ scaleY: lineScale }}
              />
            </div>

            <div className="mt-8 flex gap-3">
              {approach.steps.map((s, i) => (
                <span
                  key={s.no}
                  className={`h-1 w-12 rounded-full transition-colors duration-500 ${
                    i <= step ? 'bg-accent' : 'bg-line'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-72 md:col-span-7">
            {approach.steps.map((s, i) => (
              <motion.div
                key={s.no}
                className="absolute inset-0 flex flex-col justify-center"
                animate={{
                  opacity: i === step ? 1 : 0,
                  y: i === step ? 0 : i < step ? -40 : 40,
                  filter: i === step ? 'blur(0px)' : 'blur(6px)',
                }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                style={{ pointerEvents: i === step ? 'auto' : 'none' }}
              >
                <span className="font-display text-7xl font-semibold text-line md:text-9xl">
                  {s.no}
                </span>
                <h3 className="mt-6 text-3xl font-semibold md:text-5xl">{s.title}</h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-2">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
