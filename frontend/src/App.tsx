import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { SobreElParque } from './pages/SobreElParque'
import { Reglamento } from './pages/Reglamento'
import { InstalacionesYServicios } from './pages/InstalacionesYServicios'
import { ProgramasYProyectos } from './pages/ProgramasYProyectos'
import { MisionVisionValores } from './pages/MisionVisionValores'
import { JuntaDirectiva } from './pages/JuntaDirectiva'
import { PersonalTecnico } from './pages/PersonalTecnico'
import { Actividades } from './pages/Actividades'
import { Reserva } from './pages/Reserva'
import { Galeria } from './pages/Galeria'
import { Mapa } from './pages/Mapa'
import { Transparencia } from './pages/Transparencia'
import { Blog } from './pages/Blog'
import { Apoyanos } from './pages/Apoyanos'
import { Contacto } from './pages/Contacto'
import { Sugerencias } from './pages/Sugerencias'
import { NotFound } from './pages/NotFound'
import { AdminLogin } from './admin/AdminLogin'
import { AdminLayout } from './admin/AdminLayout'
import { EntityManager } from './admin/EntityManager'
import { MessagesInbox } from './admin/MessagesInbox'
import { SugerenciasInbox } from './admin/SugerenciasInbox'
import { TextosEditor } from './admin/TextosEditor'
import { TextosSeccion } from './admin/TextosSeccion'
import { FotoSeccion } from './admin/FotoSeccion'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-el-parque" element={<SobreElParque />} />
          <Route path="/reglamento" element={<Reglamento />} />
          <Route path="/instalaciones-y-servicios" element={<InstalacionesYServicios />} />
          <Route path="/programas-y-proyectos" element={<ProgramasYProyectos />} />
          <Route path="/mision-vision-valores" element={<MisionVisionValores />} />
          <Route path="/junta-directiva" element={<JuntaDirectiva />} />
          <Route path="/personal-tecnico" element={<PersonalTecnico />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/reserva" element={<Reserva />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/apoyanos" element={<Apoyanos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/sugerencias" element={<Sugerencias />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/junta-directiva" replace />} />
          <Route path="textos/:seccion" element={<TextosSeccion />} />
          <Route path="foto/:clave" element={<FotoSeccion />} />
          {/* Los textos ahora se editan por grupo, dentro de su sección. Esta
              ruta se conserva porque quedaron enlaces guardados apuntando aquí. */}
          <Route path="textos" element={<TextosEditor />} />
          <Route path="mensajes" element={<MessagesInbox />} />
          <Route path="sugerencias" element={<SugerenciasInbox />} />
          <Route path=":entity" element={<EntityManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
