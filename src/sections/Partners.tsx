import { Counter } from '../components/Counter'
import { Marquee } from '../components/Marquee'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { partners } from '../data/site'

/**
 * Danh sách đối tác chạy thành hai dải ngược chiều nhau.
 *
 * Chạy ngược chiều chứ không cùng chiều: hai dải cùng hướng thì mắt đọc ra
 * ngay là một vòng lặp, còn ngược chiều thì tương quan giữa hai hàng đổi
 * liên tục, nhìn lâu vẫn không thấy nó lặp lại.
 */
export function Partners() {
  const half = Math.ceil(partners.logos.length / 2)
  const rows = [partners.logos.slice(0, half), partners.logos.slice(half)]

  return (
    <section id="partners" className="py-24 md:py-36">
      <div className="shell">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={partners.eyebrow}
            title={partners.title}
            body={partners.body}
          />

          <Reveal delay={0.2}>
            <div className="shrink-0 md:text-right">
              <Counter
                to={partners.retention}
                suffix="%"
                className="font-display block text-6xl font-semibold md:text-7xl"
              />
              <p className="mt-2 max-w-[14rem] text-sm text-muted md:ml-auto">
                {partners.note}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-y border-line py-6">
        {rows.map((row, i) => (
          <Marquee key={i} duration={i === 0 ? 42 : 36} direction={i === 0 ? 'left' : 'right'}>
            {row.map((name) => (
              <span
                key={name}
                className="font-display px-8 text-2xl font-medium whitespace-nowrap text-muted transition-colors duration-300 hover:text-ink md:text-3xl"
              >
                {name}
              </span>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  )
}
