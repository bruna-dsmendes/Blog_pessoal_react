import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Cadastro from './pages/cadastro/Cadastro';
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import ListaTemas from './components/tema/listatemas/ListaTemas';
import FormTema from './components/tema/formtema/FormTema';
import DeletarTema from './components/tema/deletartema/DeletarTema';
import ListaPostagens from './components/postagem/listapostagens/ListaPostagens';
import LeituraPostagem from './pages/leiturapostagem/LeituraPostagem';
import FormPostagem from './components/postagem/formpostagem/FormPostagem';
import DeletarPostagem from './components/postagem/deletarpostagem/DeletarPostagem';
import Perfil from './pages/perfil/ Perfil';
import FormPerfil from './components/perfil/formperfil/FormPerfil';
import DeletarPerfil from './components/perfil/deletarperfil/DeletarPerfil';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <div className='flex flex-col min-h-screen'>
            <Navbar />

            <div className='flex-1'>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/temas" element={<ListaTemas />} />
                <Route path="/cadastrartema" element={<FormTema />} />
                <Route path="/editartema/:id" element={<FormTema />} />
                <Route path="/deletartema/:id" element={<DeletarTema />} />
                <Route path="/postagens" element={<ListaPostagens />} />
                <Route path="/postagem/:id" element={<LeituraPostagem />} />
                <Route path="/cadastrarpostagem" element={<FormPostagem />} />
                <Route path="/editarpostagem/:id" element={<FormPostagem />} />
                <Route path="/deletarpostagem/:id" element={<DeletarPostagem />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/editarperfil" element={<FormPerfil />} />
                <Route path="/deletarperfil" element={<DeletarPerfil />} />

              </Routes>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;