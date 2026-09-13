import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatedText } from '../components/AnimatedText'
import { Magnetic } from '../components/Magnetic'
import { usePageTransition } from '../components/PageTransition'
import { ParallaxImage } from '../components/ParallaxImage'
import { Reveal } from '../components/Reveal'
import { works } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'
import { Contact } from '../sections/Contact'

export function ProjectDetail() {
  const { slug } = useParams()
  const { go } = usePageTransition()

  const index = works.findIndex((w) => w.slug === slug)
  const work = works[index]

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])

  if (!work) {
    return (
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
        <h1 className="text-4xl font-semibold md:text-6xl">Không tìm thấy dự án.</h1>
        <p className="max-w-md text-sm text-ink-2">
          Đường dẫn có thể đã đổi. Quay lại trang chủ để xem danh sách chương trình.
        </p>
        <button
          onClick={() => go('/')}
          className="rounded-full bg-ink px-7 py-4 text-sm font-medium text-canvas transition-colors hover:bg-accent hover:text-on-accent"
        >
          Về trang chủ
        </button>
      </main>
    )
  }

  const next = works[(index + 1) % works.length]

  return (
    <>
      <main className="relative z-10">
        {/* ---------------------------------------------------------- mở đầu */}
        <section ref={heroRef} className="pt-28 md:pt-36">
          <div className="shell">
            <Reveal>
              <button
                onClick={() => go('/')}
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <span className="transition-transform duration-400 group-hover:-translate-x-1">
                  ←
                </span>
                Tất cả chương trình
              </button>
            </Reveal>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="eyebrow">
                {work.category} · {work.year}
              </span>
            </div>

            <AnimatedText
              as="h1"
              text={work.title}
              delay={0.1}
              className="mt-6 max-w-4xl text-[10vw] leading-[1.02] font-semibold md:text-[5.5vw]"
            />
          </div>

          <div className="shell mt-12">
            <motion.div
              className="relative h-[46vh] overflow-hidden rounded-3xl bg-surface md:h-[72vh]"
              initial={{ clipPath: 'inset(14% 10% 14% 10% round 24px)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
            >
              <motion.img
                src={work.image}
                alt={work.title}
                className="h-full w-full object-cover"
                style={{ y: imageY, scale: imageScale }}
              />
            </motion.div>
          </div>
        </section>

        {/* ------------------------------------------------- thông tin & phạm vi */}
        <section className="shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-5">
            <Reveal>
              <dl className="flex flex-col gap-6 border-t border-line pt-6">
                {[
                  ['Khách hàng', work.client],
                  ['Địa điểm', work.venue],
                  ['Thời gian', work.duration],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-6">
                    <dt className="eyebrow">{label}</dt>
                    <dd className="text-right text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <p className="text-xl leading-relaxed md:text-2xl">{work.summary}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="mt-14 text-sm tracking-[0.18em] text-muted uppercase">
                Hạng mục thực hiện
              </h2>
              <ul className="mt-6 border-t border-line">
                {work.scope.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-b border-line py-4 text-sm"
                  >
                    <span className="mt-0.5 text-accent">—</span>
                    <span className="text-ink-2">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------------------- hình ảnh */}
        <section className="shell py-20 md:py-28">
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {work.gallery.map((src, i) => (
              <ParallaxImage
                key={src}
                src={src}
                alt={`${work.title} — hình ${i + 1}`}
                amount={8 + (i % 3) * 4}
                className={i === 1 ? 'aspect-3/4 md:-translate-y-6' : 'aspect-4/5'}
              />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ dự án kế tiếp */}
        <section className="shell pb-24 md:pb-32">
          <Reveal>
            <button
              onClick={() => go(`/du-an/${next.slug}`)}
              data-cursor="Xem"
              className="group block w-full border-t border-line pt-10 text-left"
            >
              <span className="eyebrow">Chương trình tiếp theo</span>
              <div className="mt-5 flex items-center justify-between gap-6">
                <h2 className="text-3xl font-semibold md:text-6xl">{next.title}</h2>
                <Magnetic>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line text-xl transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                    →
                  </span>
                </Magnetic>
              </div>
            </button>
          </Reveal>
        </section>
      </main>

      <Contact />
    </>
  )
}
