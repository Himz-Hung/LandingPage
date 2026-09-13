import { motion } from 'motion/react'
import { maskLine, stagger } from '../lib/motion'

type Props = {
  text: string
  className?: string
  /** Độ trễ trước khi chữ đầu tiên chạy. */
  delay?: number
  /** Tách theo 'word' (mặc định) hoặc 'char'. */
  by?: 'word' | 'char'
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Chữ trượt lên từ dưới một lớp mask, từng từ lệch nhau.
 * Mỗi từ nằm trong một span overflow-hidden nên phần thừa bị cắt gọn.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  by = 'word',
  as = 'span',
}: Props) {
  const pieces = by === 'word' ? text.split(' ') : text.split('')
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={stagger(delay, by === 'word' ? 0.055 : 0.02)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      aria-label={text}
    >
      {pieces.map((piece, i) => (
        <span
          key={`${piece}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span variants={maskLine} className="inline-block pb-[0.12em]">
            {piece}
            {by === 'word' && i < pieces.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
