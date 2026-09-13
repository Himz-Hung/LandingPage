import type { Variants } from 'motion/react'

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/** Khối trồi lên khi lọt vào viewport. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
}

/** Container để các con chạy lệch nhau. */
export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})

/** Một dòng chữ bị "mask" trượt lên từ dưới. */
export const maskLine: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

/** Ảnh phóng nhẹ từ 1.15 về 1 kèm màn che kéo lên. */
export const imageReveal: Variants = {
  hidden: { scale: 1.18 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease: EASE_OUT_EXPO },
  },
}

export const curtain: Variants = {
  hidden: { y: '0%' },
  visible: {
    y: '-101%',
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
}
