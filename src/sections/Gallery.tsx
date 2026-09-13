import { Magnetic } from '../components/Magnetic'
import { ParallaxImage } from '../components/ParallaxImage'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { gallery } from '../data/site'

export function Gallery() {
  return (
    <section className="bg-surface/70 py-24 backdrop-blur-sm md:py-36">
      <div className="shell">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            body={gallery.body}
          />

          <Reveal delay={0.2}>
            <Magnetic>
              <a
                href="#contact"
                className="group flex items-center gap-3 rounded-full bg-ink py-4 pr-4 pl-7 text-sm font-medium whitespace-nowrap text-canvas transition-colors duration-300 hover:bg-accent"
              >
                Đặt lịch chụp
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-400 group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        {/* Lưới so le, mỗi ảnh trôi lệch một nhịp khác nhau khi cuộn */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {gallery.images.map((src, i) => (
            <ParallaxImage
              key={src}
              src={src}
              alt={`Ảnh ${i + 1}`}
              amount={8 + (i % 3) * 5}
              className={
                i % 2 === 0
                  ? 'aspect-3/4 md:translate-y-8'
                  : 'aspect-3/4 md:-translate-y-4'
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
