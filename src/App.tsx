import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { Grain } from './components/Grain'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { SectionThemeProvider } from './lib/SectionTheme'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { StageScene } from './three/StageScene'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Journal } from './sections/Journal'
import { StackingWork } from './sections/StackingWork'

function App() {
  useSmoothScroll()
  const [loading, setLoading] = useState(true)

  // Khoá cuộn trong lúc màn chờ còn hiện.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <SectionThemeProvider>
      {/* Cảnh 3D duy nhất, nằm cố định sau toàn bộ trang */}
      <StageScene />

      <Cursor />
      <Grain />
      <ScrollProgress />

      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <StackingWork />
        <Journal />
      </main>

      <Contact />
    </SectionThemeProvider>
  )
}

export default App
