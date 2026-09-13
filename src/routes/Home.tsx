import { Contact } from '../sections/Contact'
import { Hero } from '../sections/Hero'
import { Journal } from '../sections/Journal'
import { Partners } from '../sections/Partners'
import { StackingWork } from '../sections/StackingWork'
import { Testimonials } from '../sections/Testimonials'

export function Home() {
  return (
    <>
      <main className="relative z-10">
        <Hero />
        <StackingWork />
        <Partners />
        <Testimonials />
        <Journal />
      </main>

      <Contact />
    </>
  )
}
