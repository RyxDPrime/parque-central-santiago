import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { SobreElParque } from './pages/SobreElParque'
import { MisionYVision } from './pages/MisionYVision'
import { InstalacionesYServicios } from './pages/InstalacionesYServicios'
import { ProgramasYProyectos } from './pages/ProgramasYProyectos'
import { JuntaDirectiva } from './pages/JuntaDirectiva'
import { Actividades } from './pages/Actividades'
import { Galeria } from './pages/Galeria'
import { Aliados } from './pages/Aliados'
import { Transparencia } from './pages/Transparencia'
import { Contacto } from './pages/Contacto'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-el-parque" element={<SobreElParque />} />
          <Route path="/mision-y-vision" element={<MisionYVision />} />
          <Route path="/instalaciones-y-servicios" element={<InstalacionesYServicios />} />
          <Route path="/programas-y-proyectos" element={<ProgramasYProyectos />} />
          <Route path="/junta-directiva" element={<JuntaDirectiva />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/aliados-y-patrocinadores" element={<Aliados />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
