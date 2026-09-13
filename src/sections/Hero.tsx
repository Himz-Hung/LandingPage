import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { AnimatedText } from '../components/AnimatedText'
import { Magnetic } from '../components/Magnetic'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { ScrambleText } from '../components/ScrambleText'
import { hero, marqueeWords, site } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'
import { scrollToSection } from '../lib/useSmoothScroll'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Ảnh và chữ trôi lệch nhau khi cuộn qua hero.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="top" ref={ref} className="relative pt-28 md:pt-36">

      <motion.div className="relative z-10 shell" style={{ y: textY, opacity: textOpacity }}>
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <ScrambleText className="eyebrow" text={hero.greeting} />
          </div>
        </Reveal>

        <AnimatedText
          as="h1"
          text={hero.headline}
          delay={0.15}
          className="mt-8 max-w-5xl text-[13vw] leading-[0.92] font-semibold md:text-[6.5vw]"
        />

        <div className="mt-10 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.25} className="max-w-md">
            <p className="text-base leading-relaxed text-ink-2">{hero.paragraph}</p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <button
                  onClick={() => scrollToSection(hero.ctaPrimary.href)}
                  className="group flex items-center gap-3 rounded-full bg-ink py-4 pr-4 pl-7 text-sm font-medium text-canvas transition-colors duration-300 hover:bg-accent"
                >
                  {hero.ctaPrimary.label}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-400 group-hover:rotate-45">
                    ↗
                  </span>
                </button>
              </Magnetic>

              <Magnetic>
                <button
                  onClick={() => scrollToSection(hero.ctaSecondary.href)}
                  className="rounded-full border border-line px-7 py-4 text-sm font-medium transition-colors duration-300 hover:border-ink"
                >
                  {hero.ctaSecondary.label}
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </motion.div>

      <div className="shell mt-14">
        <motion.div
          className="relative h-[52vh] overflow-hidden rounded-3xl bg-surface md:h-[78vh]"
          initial={{ clipPath: 'inset(12% 8% 12% 8% round 24px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.4 }}
        >
          <motion.img
            src={hero.image}
            alt="Ảnh bìa portfolio"
            className="h-full w-full object-cover"
            style={{ y: imageY, scale: imageScale }}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-8">
            <div className="rounded-full bg-canvas/90 px-4 py-2 text-xs font-medium backdrop-blur">
              {site.location} · {site.timezone}
            </div>
            <div className="hidden rounded-full bg-canvas/90 px-4 py-2 text-xs font-medium backdrop-blur md:block">
              Cuộn xuống ↓
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 border-y border-line py-5">
        <Marquee duration={34}>
          {marqueeWords.map((word) => (
            <span
              key={word}
              className="font-display flex items-center gap-8 px-8 text-3xl font-medium whitespace-nowrap md:text-5xl"
            >
              {word}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
