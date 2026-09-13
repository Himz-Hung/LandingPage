import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { nav, site } from '../data/site'
import { EASE_OUT_EXPO } from '../lib/motion'
import { useOnContrast } from '../lib/SectionTheme'
import { scrollToSection, startScroll, stopScroll } from '../lib/useSmoothScroll'
import { usePageTransition } from './PageTransition'
import { Magnetic } from './Magnetic'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { go: navigateTo } = usePageTransition()
  const atHome = pathname === '/'

  // Nav phải lật màu khi nằm trên section đảo tương phản, VÀ khi menu mobile
  // đang mở — lúc đó nền dưới nav chính là tấm menu màu nghịch.
  // Việc này độc lập với light/dark mode của cả trang.
  const onContrast = useOnContrast() || menuOpen

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setSolid(latest > 24)
    if (menuOpen) return
    setHidden(latest > previous && latest > 160)
  })

  const go = (href: string) => {
    closeMenu()

    // Đang ở trang con thì các mỏ neo (#work, #journal) không tồn tại.
    // Phải về trang chủ trước, rồi đợi trang mới dựng xong mới cuộn tới.
    if (!atHome) {
      navigateTo('/')
      setTimeout(() => scrollToSection(href), 1400)
      return
    }

    setTimeout(() => scrollToSection(href), menuOpen ? 500 : 0)
  }

  const openMenu = () => {
    setMenuOpen(true)
    stopScroll()
  }

  const closeMenu = () => {
    setMenuOpen(false)
    startScroll()
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{
          y: hidden ? '-110%' : '0%',
          color: onContrast ? 'var(--c-on-invert)' : 'var(--c-ink)',
        }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        <div
          className={`transition-colors duration-500 ${onContrast ? 'on-contrast' : ''} ${
            solid && !menuOpen
              ? onContrast
                ? 'border-b border-invert-line bg-invert/70 backdrop-blur-md'
                : 'border-b border-line bg-canvas/80 backdrop-blur-md'
              : 'border-b border-transparent'
          }`}
        >
          <div className="shell flex h-16 items-center justify-between md:h-20">
            <button
              onClick={() => (atHome ? scrollToSection('#top') : navigateTo('/'))}
              className="font-display text-lg font-semibold tracking-tight"
            >
              {site.name}
              <sup className="ml-0.5 text-[0.6em] text-accent">®</sup>
            </button>

            <nav className="hidden items-center gap-8 md:flex">
              {nav.map((item) => (
                <button
                  key={item.href}
                  onClick={() => go(item.href)}
                  className={`group relative text-sm transition-colors ${
                    onContrast
                      ? 'text-invert-muted hover:text-on-invert'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-400 group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Magnetic className="hidden md:block">
                <button
                  onClick={() => go('#contact')}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:bg-accent hover:text-on-accent ${
                    onContrast ? 'bg-on-invert text-invert' : 'bg-ink text-canvas'
                  }`}
                >
                  Liên hệ
                </button>
              </Magnetic>

              <button
                onClick={() => (menuOpen ? closeMenu() : openMenu())}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
                aria-label="Mở menu"
              >
                <motion.span
                  className="block h-px w-6"
                  animate={{
                    rotate: menuOpen ? 45 : 0,
                    y: menuOpen ? 3.5 : 0,
                    backgroundColor: 'var(--c-ink)',
                  }}
                />
                <motion.span
                  className="block h-px w-6"
                  animate={{
                    rotate: menuOpen ? -45 : 0,
                    y: menuOpen ? -3.5 : 0,
                    backgroundColor: 'var(--c-ink)',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="contrast-section fixed inset-0 z-40 flex flex-col justify-center px-5 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            {/* py-1 ở mỗi dòng để lớp mask không xén mất dấu phía trên chữ */}
            <nav className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <div key={item.href} className="overflow-hidden py-1">
                  <motion.button
                    onClick={() => go(item.href)}
                    className="font-display text-left text-5xl leading-[1.1] font-semibold"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{
                      duration: 0.7,
                      ease: EASE_OUT_EXPO,
                      delay: 0.15 + i * 0.06,
                    }}
                  >
                    {item.label}
                  </motion.button>
                </div>
              ))}
            </nav>

            <motion.a
              href={`mailto:${site.email}`}
              className="mt-12 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              {site.email}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
