import { motion } from 'motion/react'
import { useRef } from 'react'
import { EASE_OUT_EXPO } from '../lib/motion'
import { useTheme } from '../lib/theme'

/**
 * Nút đổi theme. Truyền tâm của chính nút vào hàm toggle
 * để hiệu ứng loang bắt đầu đúng từ chỗ người dùng vừa bấm.
 */
export function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null)
  const { mode, toggle } = useTheme()
  const isDark = mode === 'dark'

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) {
      toggle()
      return
    }
    toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      aria-label={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-ink"
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
        {/* Vòng tròn co lại khi sang chế độ tối để lộ hình lưỡi liềm */}
        <motion.circle
          cx="12"
          cy="12"
          r="9"
          fill="currentColor"
          animate={{ r: isDark ? 9 : 5 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        />
        {/* Khối khoét dùng màu nền, trượt vào để cắt vầng trăng */}
        <motion.circle
          cx="12"
          cy="12"
          r="8"
          className="text-canvas"
          fill="var(--c-canvas)"
          animate={{ cx: isDark ? 17 : 30, cy: isDark ? 7 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        />
        {/* Tia nắng, thu về tâm khi chuyển sang tối */}
        <motion.g
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.4 : 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          style={{ originX: '12px', originY: '12px' }}
        >
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.4" y2="4.6" />
        </motion.g>
      </svg>
    </button>
  )
}
