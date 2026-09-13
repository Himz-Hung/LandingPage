import { AnimatedText } from '../components/AnimatedText'
import { Magnetic } from '../components/Magnetic'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { site, socials } from '../data/site'

export function Contact() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      data-contrast
      className="contrast-section contrast-veil relative z-10 pt-24 md:pt-36"
    >
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="eyebrow text-muted">Liên hệ</span>
          </div>
        </Reveal>

        <AnimatedText
          as="h2"
          text="Kể mình nghe dự án của bạn."
          delay={0.1}
          className="mt-8 max-w-4xl text-[11vw] leading-[0.95] font-semibold md:text-[6vw]"
        />

        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 rounded-full bg-ink py-4 pr-4 pl-7 text-sm font-medium text-canvas transition-colors duration-300 hover:bg-accent hover:text-on-accent"
              >
                {site.email}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-400 group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>

            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Nhận dự án ở mọi múi giờ. Thường phản hồi trong vòng một ngày làm việc.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Dải chạy ngang ngăn cách phần chân trang */}
      <div className="mt-24 border-y border-line py-5">
        <Marquee duration={26} direction="right">
          {['Cùng làm gì đó hay ho', 'Còn nhận dự án Q4 2026'].map((text) => (
            <span
              key={text}
              className="font-display flex items-center gap-8 px-8 text-3xl font-medium whitespace-nowrap text-ink-2 md:text-4xl"
            >
              {text}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {social.label}
            </a>
          ))}
        </div>

        <p className="text-sm text-muted">
          © {year} {site.name}. Template dựng bằng React + Motion.
        </p>
      </div>
    </footer>
  )
}
