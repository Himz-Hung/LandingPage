import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatedText } from '../components/AnimatedText'
import { Magnetic } from '../components/Magnetic'
import { usePageTransition } from '../components/PageTransition'
import { Reveal } from '../components/Reveal'
import { journal, site } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'
import { Contact } from '../sections/Contact'

/**
 * Nội dung bài viết lưu thành từng khối thay vì một chuỗi HTML.
 * Nhờ vậy mỗi loại khối có kiểu chữ riêng, và không phải nhét thẻ HTML
 * vào file dữ liệu — người viết nội dung chỉ cần biết bốn loại khối.
 */
type Block = { type: string; text?: string; items?: string[] }

export function JournalDetail() {
  const { slug } = useParams()
  const { go } = usePageTransition()

  const index = journal.findIndex((p) => p.slug === slug)
  const post = journal[index]

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  if (!post) {
    return (
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
        <h1 className="text-4xl font-semibold md:text-6xl">Không tìm thấy bài viết.</h1>
        <button
          onClick={() => go('/')}
          className="rounded-full bg-ink px-7 py-4 text-sm font-medium text-canvas transition-colors hover:bg-accent hover:text-on-accent"
        >
          Về trang chủ
        </button>
      </main>
    )
  }

  const next = journal[(index + 1) % journal.length]
  const blocks = post.body as Block[]

  return (
    <>
      <main className="relative z-10">
        <section ref={heroRef} className="pt-28 md:pt-36">
          <div className="shell max-w-4xl">
            <Reveal>
              <button
                onClick={() => go('/')}
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
              >
                <span className="transition-transform duration-400 group-hover:-translate-x-1">
                  ←
                </span>
                Tất cả bài viết
              </button>
            </Reveal>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-line" />
              <span>{post.readTime}</span>
              <span className="h-1 w-1 rounded-full bg-line" />
              <span>{post.author}</span>
            </div>

            <AnimatedText
              as="h1"
              text={post.title}
              delay={0.1}
              className="mt-6 text-[9vw] leading-[1.06] font-semibold md:text-[4.4vw]"
            />

            <Reveal delay={0.25}>
              <p className="mt-8 text-xl leading-relaxed text-ink-2 md:text-2xl">
                {post.excerpt}
              </p>
            </Reveal>
          </div>

          <div className="shell mt-14">
            <motion.div
              className="relative h-[40vh] overflow-hidden rounded-3xl bg-surface md:h-[62vh]"
              initial={{ clipPath: 'inset(14% 10% 14% 10% round 24px)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
            >
              <motion.img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
                style={{ y: imageY, scale: imageScale }}
              />
            </motion.div>
          </div>
        </section>

        {/* Bề ngang cột chữ giới hạn quanh 70 ký tự — dài hơn thì mắt khó
            bắt được đầu dòng kế tiếp khi xuống dòng. */}
        <article className="shell max-w-3xl py-20 md:py-28">
          {blocks.map((block, i) => {
            if (block.type === 'h') {
              return (
                <Reveal key={i}>
                  <h2 className="mt-14 mb-5 text-2xl font-semibold md:text-3xl">
                    {block.text}
                  </h2>
                </Reveal>
              )
            }

            if (block.type === 'quote') {
              return (
                <Reveal key={i}>
                  <blockquote className="my-12 border-l-2 border-accent pl-6 md:pl-8">
                    <p className="font-display text-xl leading-snug font-medium md:text-2xl">
                      {block.text}
                    </p>
                  </blockquote>
                </Reveal>
              )
            }

            if (block.type === 'list') {
              return (
                <Reveal key={i}>
                  <ul className="my-6 border-t border-line">
                    {block.items?.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-4 border-b border-line py-4"
                      >
                        <span className="mt-1 text-accent">—</span>
                        <span className="leading-relaxed text-ink-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )
            }

            return (
              <Reveal key={i}>
                <p className="mb-6 leading-[1.75] text-ink-2">{block.text}</p>
              </Reveal>
            )
          })}

          <Reveal>
            <div className="mt-16 flex items-center gap-4 border-t border-line pt-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent">
                {site.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium">{post.author}</p>
                <p className="text-sm text-muted">{site.role}</p>
              </div>
            </div>
          </Reveal>
        </article>

        <section className="shell pb-24 md:pb-32">
          <Reveal>
            <button
              onClick={() => go(`/tin-tuc/${next.slug}`)}
              data-cursor="Đọc"
              className="group block w-full border-t border-line pt-10 text-left"
            >
              <span className="eyebrow">Bài tiếp theo</span>
              <div className="mt-5 flex items-center justify-between gap-6">
                <h2 className="text-2xl leading-snug font-semibold md:text-5xl">
                  {next.title}
                </h2>
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
