import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'

type Mode = 'light' | 'dark'

type ThemeValue = {
  mode: Mode
  /** Đổi theme, loang ra từ toạ độ của phần tử vừa bấm. */
  toggle: (origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeValue>({ mode: 'light', toggle: () => {} })

export const useTheme = () => useContext(ThemeContext)

export const THEME_STORAGE_KEY = 'viper-theme'

function readInitialMode(): Mode {
  if (typeof document === 'undefined') return 'light'
  // Script chặn nháy trong index.html đã đặt sẵn thuộc tính này trước khi vẽ
  const applied = document.documentElement.dataset.theme
  if (applied === 'dark' || applied === 'light') return applied
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(readInitialMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // Chế độ riêng tư chặn localStorage — bỏ qua, theme vẫn chạy trong phiên
    }
  }, [mode])

  // Bám theo cài đặt hệ thống, nhưng chỉ khi người dùng chưa tự chọn
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return
      } catch {
        /* không đọc được thì cứ theo hệ thống */
      }
      setMode(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Mode = mode === 'dark' ? 'light' : 'dark'

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const supported = typeof document.startViewTransition === 'function'

      if (!supported || reduced || !origin) {
        setMode(next)
        return
      }

      const { x, y } = origin
      // Bán kính phải với tới góc xa nhất, nếu không sẽ hở một mảng chưa đổi màu
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      const transition = document.startViewTransition(() => {
        // flushSync để React vẽ xong theme mới TRƯỚC khi trình duyệt chụp ảnh
        flushSync(() => setMode(next))
      })

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 720,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
    },
    [mode],
  )

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
