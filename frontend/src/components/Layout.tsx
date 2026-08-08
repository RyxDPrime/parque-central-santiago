import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { ScrollTopButton } from './ScrollTopButton'
import { AlertBar } from './AlertBar'
import { usePageMeta } from '../hooks/usePageMeta'

export function Layout() {
  usePageMeta()

  return (
    <div className="page">
      <ScrollToTop />
      <AlertBar />
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollTopButton />
    </div>
  )
}
