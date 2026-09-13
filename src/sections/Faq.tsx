import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { faqs } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="shell py-24 md:py-36">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <SectionHeader
          eyebrow="Câu hỏi thường gặp"
          title="Những thứ hay được hỏi."
          className="md:col-span-5"
        />

        <div className="md:col-span-7">
          <div className="border-t border-line">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <div className="border-b border-line">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={open === i}
                  >
                    <span className="text-lg font-medium md:text-xl">{faq.q}</span>
                    <motion.span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-lg"
                      animate={{
                        rotate: open === i ? 135 : 0,
                        backgroundColor:
                          open === i ? 'var(--color-accent)' : 'rgba(0,0,0,0)',
                        color: open === i ? '#ffffff' : 'var(--color-ink)',
                        borderColor:
                          open === i ? 'var(--color-accent)' : 'var(--color-line)',
                      }}
                      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm leading-relaxed text-ink-2 md:max-w-lg">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
