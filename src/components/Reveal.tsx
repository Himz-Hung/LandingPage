import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { riseIn } from '../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  /** Chạy lại mỗi lần cuộn qua thay vì chỉ một lần. */
  repeat?: boolean
}

/** Bọc bất kỳ khối nào để nó trồi lên khi lọt vào viewport. */
export function Reveal({ children, className, delay = 0, repeat = false }: Props) {
  return (
    <motion.div
      className={className}
      variants={riseIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, margin: '-12% 0px -12% 0px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
