import { AnimatedText } from './AnimatedText'
import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: string
  body?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, body, className = '' }: Props) {
  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>

      <AnimatedText
        as="h2"
        text={title}
        delay={0.1}
        className="mt-6 max-w-3xl text-4xl font-semibold md:text-6xl"
      />

      {body && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2">{body}</p>
        </Reveal>
      )}
    </div>
  )
}
