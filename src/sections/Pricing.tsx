import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { pricing } from '../data/site'

export function Pricing() {
  return (
    <section id="pricing" className="shell py-24 md:py-36">
      <SectionHeader eyebrow={pricing.eyebrow} title={pricing.title} body={pricing.note} />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {pricing.plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.1}>
            {/* Thẻ nổi bật chỉ cần thêm .contrast-section: class con bên trong
                giữ nguyên mà màu tự lật, không phải viết ternary cho từng dòng */}
            <div
              className={`group flex h-full flex-col rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 md:p-10 ${
                plan.featured
                  ? 'contrast-section'
                  : 'border border-line bg-canvas hover:border-ink'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-on-accent">
                    Chọn nhiều nhất
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-ink-2">{plan.body}</p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold">{plan.price}</span>
                <span className="text-sm text-muted">{plan.period}</span>
              </div>

              <div className="my-8 h-px w-full bg-line" />

              <ul className="flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <span className="text-accent">✓</span>
                    <span className="text-ink-2">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-10 rounded-full bg-ink py-4 text-center text-sm font-medium text-canvas transition-colors duration-300 hover:bg-accent hover:text-on-accent"
              >
                Chọn gói này
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
