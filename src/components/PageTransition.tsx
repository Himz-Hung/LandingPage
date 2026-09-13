import { AnimatePresence, motion } from 'motion/react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { site } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'
import { scrollToTop, startScroll, stopScroll } from '../lib/useSmoothScroll'

const COLUMNS = 5
const COVER = 0.62
const STAGGER = 0.055

type Ctx = { go: (to: string) => void; busy: boolean }

const TransitionContext = createContext<Ctx>({ go: () => {}, busy: false })

export const usePageTransition = () => useContext(TransitionContext)

type Phase = 'idle' | 'covering' | 'revealing'

/**
 * Chuyển trang bằng rèm cột quét qua màn hình.
 *
 * Năm cột lệch pha nhau kéo lên che kín, ĐỔI ROUTE lúc màn hình đang bị che,
 * rồi cùng những cột đó tiếp tục đi lên để lộ trang mới. Rèm đi một mạch
 * cùng chiều chứ không kéo lên rồi hạ xuống — kéo ngược lại thì mắt đọc ra
 * ngay là hai động tác rời, còn đi một mạch thì thành một cú quét liền.
 *
 * Đổi route đúng lúc bị che là mấu chốt: người xem không bao giờ thấy
 * khoảnh khắc trang cũ biến mất.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('idle')
  const pending = useRef<string | null>(null)

  const go = useCallback(
    (to: string) => {
      if (phase !== 'idle') return // đang chuyển thì bỏ qua cú bấm thứ hai
      pending.current = to
      stopScroll()
      setPhase('covering')
    },
    [phase],
  )

  // Chạy khi cột CUỐI CÙNG che xong, không phải cột đầu
  const onCovered = useCallback(() => {
    if (pending.current) {
      navigate(pending.current)
      pending.current = null
      scrollToTop()
    }
    setPhase('revealing')
  }, [navigate])

  const onRevealed = useCallback(() => {
    setPhase('idle')
    startScroll()
  }, [])

  const value = useMemo(() => ({ go, busy: phase !== 'idle' }), [go, phase])

  return (
    <TransitionContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[95] flex"
            initial={false}
          >
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-invert"
                initial={{ y: '100%' }}
                animate={{ y: phase === 'covering' ? '0%' : '-100%' }}
                transition={{
                  duration: COVER,
                  ease: EASE_OUT_EXPO,
                  delay: i * STAGGER,
                }}
                // Cột cuối quyết định thời điểm, vì nó về đích sau cùng
                onAnimationComplete={
                  i === COLUMNS - 1
                    ? phase === 'covering'
                      ? onCovered
                      : onRevealed
                    : undefined
                }
              />
            ))}

            {/* Tên thương hiệu hiện lên trong lúc màn hình bị che */}
            <motion.span
              className="font-display absolute inset-0 flex items-center justify-center text-2xl font-semibold text-on-invert"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'covering' ? 1 : 0 }}
              transition={{ duration: 0.35, delay: phase === 'covering' ? 0.3 : 0 }}
            >
              {site.name}
              <sup className="ml-0.5 text-[0.5em] text-accent">®</sup>
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}
