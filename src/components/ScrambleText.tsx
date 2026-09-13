import { useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#____'

type Props = {
  text: string
  className?: string
  /** Tốc độ giải mã: số frame mỗi ký tự. */
  speed?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
}

/**
 * Chữ hiện ra kiểu "giải mã": ký tự rác rồi lần lượt chốt về chữ thật từ trái sang.
 * Chạy trên requestAnimationFrame, không dùng thư viện ngoài.
 */
export function ScrambleText({ text, className, speed = 2.2, as = 'span' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [output, setOutput] = useState(() => ' '.repeat(text.length))

  useEffect(() => {
    if (!inView) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setOutput(text)
      return
    }

    let frame = 0
    let raf = 0

    // Mỗi ký tự có mốc bắt đầu và kết thúc riêng nên chúng chốt lệch nhau.
    const queue = text.split('').map((char, i) => ({
      char,
      start: i * speed,
      end: i * speed + 8 + Math.random() * 12,
    }))

    const tick = () => {
      let done = 0
      const next = queue
        .map(({ char, start, end }) => {
          if (char === ' ') return ' '
          if (frame >= end) {
            done += 1
            return char
          }
          if (frame < start) return ' '
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')

      setOutput(next)
      if (done === queue.filter((q) => q.char !== ' ').length) return

      frame += 1
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, speed])

  const Tag = as as 'span'

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden>{output}</span>
    </Tag>
  )
}
