import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { testimonials } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1)
    setIndex((next + testimonials.length) % testimonials.length)
  }

  // Tự chuyển slide, dừng lại khi người dùng bấm nút.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % testimonials.length)
    }, 6500)
    return () => clearTimeout(timer)
  }, [index])

  const item = testimonials[index]

  return (
    <section className="shell py-24 md:py-36">
      <SectionHeader eyebrow="Khách hàng nói gì" title="Nhận xét sau đêm diễn." />

      <div className="mt-16 grid gap-10 md:grid-cols-12">
        <div className="relative min-h-64 md:col-span-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={index}
              custom={direction}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              <p className="font-display text-2xl leading-snug font-medium md:text-4xl">
                “{item.quote}”
              </p>

              <footer className="mt-8 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-muted">{item.title}</p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="flex items-end justify-between md:col-span-4 md:flex-col md:items-end md:justify-end md:gap-8">
          <div className="flex gap-2">
            <button
              onClick={() => go(index - 1)}
              aria-label="Nhận xét trước"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
            >
              ←
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Nhận xét sau"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
            >
              →
            </button>
          </div>

          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => go(i)}
                aria-label={`Nhận xét ${i + 1}`}
                className="h-1 w-10 overflow-hidden rounded-full bg-line"
              >
                <motion.span
                  className="block h-full bg-accent"
                  animate={{ scaleX: i === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  style={{ originX: 0 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
