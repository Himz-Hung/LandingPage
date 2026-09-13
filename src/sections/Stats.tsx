import { Counter } from '../components/Counter'
import { Reveal } from '../components/Reveal'
import { stats } from '../data/site'

export function Stats() {
  return (
    <section
      data-contrast
      className="contrast-section contrast-veil relative overflow-hidden py-20 md:py-28"
    >

      <div className="relative z-10 shell grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="md:border-l md:border-line md:pl-8">
              <Counter
                to={stat.value}
                suffix={stat.suffix}
                className="font-display block text-5xl font-semibold md:text-6xl"
              />
              <p className="mt-3 text-sm text-muted">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
