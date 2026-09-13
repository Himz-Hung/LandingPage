import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Cursor } from './components/Cursor'
import { Grain } from './components/Grain'
import { Navbar } from './components/Navbar'
import { PageTransition } from './components/PageTransition'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { SectionThemeProvider } from './lib/SectionTheme'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { Home } from './routes/Home'
import { JournalDetail } from './routes/JournalDetail'
import { ProjectDetail } from './routes/ProjectDetail'
import { StageScene } from './three/StageScene'

function Shell() {
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
      {/*
        Cảnh 3D nằm NGOÀI phần đổi trang. Nếu đặt trong Routes thì mỗi lần
        chuyển trang canvas bị tháo rồi dựng lại: mất vài trăm mili giây khởi
        tạo WebGL, con cá nhảy về vị trí đầu, mặt nước mất sạch gợn đang lan.
      */}
      <StageScene />

      <Cursor />
      <Grain />
      <ScrollProgress />

      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <PageTransition>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/du-an/:slug" element={<ProjectDetail />} />
          <Route path="/tin-tuc/:slug" element={<JournalDetail />} />
          <Route path="*" element={<ProjectDetail />} />
        </Routes>
      </PageTransition>
    </SectionThemeProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

export default App
