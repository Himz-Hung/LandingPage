import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

/**
 * Cho biết thanh nav đang nằm trên section đảo tương phản hay không.
 * Đây KHÔNG phải light/dark mode — nó chỉ nói "nền dưới nav đang là màu nghịch",
 * nên nav và con trỏ cần lật màu theo, bất kể đang ở theme nào.
 */
const ContrastContext = createContext(false)

export const useOnContrast = () => useContext(ContrastContext)

export function SectionThemeProvider({ children }: { children: ReactNode }) {
  const [onContrast, setOnContrast] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-contrast]')
    if (!targets.length) return

    // Dải quan sát mỏng đúng bằng vùng thanh nav ở đỉnh màn hình
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting)
        if (hit) setOnContrast(true)
        else if (entries.some((entry) => !entry.isIntersecting)) setOnContrast(false)
      },
      { rootMargin: '-72px 0px -100% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return <ContrastContext.Provider value={onContrast}>{children}</ContrastContext.Provider>
}
