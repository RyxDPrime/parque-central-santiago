import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { AlertBar } from './AlertBar'

export function Layout() {
  return (
    <div className="page">
      <ScrollToTop />
      <AlertBar />
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
