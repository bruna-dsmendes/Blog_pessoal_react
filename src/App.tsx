import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import FormPerfil from './components/perfil/formperfil/FormPerfil'
import FormPostagem from './components/postagem/formpostagem/FormPostagem'
import { AuthProvider } from './contexts/AuthContext'
import Artigo from './pages/artigo/Artigo'
import Autor from './pages/autor/Autor'
import Cadastro from './pages/cadastro/Cadastro'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import MinhasPostagens from './pages/minhaspostagens/MinhasPostagens'
import Perfil from './pages/perfil/Perfil'
import PorTag from './pages/portag/PorTag'
import RotaProtegida from './routes/RotaProtegida'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
      <ToastContainer />

      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/artigo/:slug" element={<Artigo />} />
              <Route path="/tag/:slug" element={<PorTag />} />
              <Route path="/autor/:username" element={<Autor />} />

              {/* Exigem sessão */}
              <Route element={<RotaProtegida />}>
                <Route path="/minhas-postagens" element={<MinhasPostagens />} />
                <Route path="/postagens/nova" element={<FormPostagem />} />
                <Route path="/postagens/:id/editar" element={<FormPostagem />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/editar" element={<FormPerfil />} />
              </Route>

              {/* Rotas antigas que já circularam em links. */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/postagens" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
