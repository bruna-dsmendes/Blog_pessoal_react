import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { ToastAlerta } from '../../utils/ToastAlerta'

function Navbar() {

  const navigate = useNavigate()
  const { estaAutenticado, handleLogout } = useContext(AuthContext)

  async function sair() {
    await handleLogout()
    ToastAlerta('Você saiu da sua conta', 'info')
    navigate('/')
  }

  const link = 'hover:text-[#5ea2df] transition-colors duration-200'

  return (
    <header className="flex justify-center w-full py-4 bg-sky-100 text-sky-900 border-b-2 border-[#5ea2df]">
      <div className="container flex items-center justify-between mx-8 text-lg">

        <Link to="/" className="text-2xl font-bold">
          <div className="flex items-center gap-4 py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" className="w-11 h-11 text-[#5ea2df] stroke-[2.5]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>

            <div className="flex flex-col justify-center">
              <span className="text-2xl font-black tracking-tight leading-tight text-slate-800">
                Simetria<span className="text-[#5ea2df]">.Dev</span>
              </span>
              <span className="mt-1 text-xs font-bold leading-none uppercase font-mono tracking-widest text-slate-500">
                Estudos &amp; Resumos
              </span>
            </div>
          </div>
        </Link>

        <nav className="flex gap-6 text-sm font-semibold tracking-wide uppercase font-sans text-slate-700">
          <Link to="/" className={link}>Feed</Link>

          {estaAutenticado ? (
            <>
              <Link to="/minhas-postagens" className={link}>Minhas postagens</Link>
              <Link to="/perfil" className={link}>Perfil</Link>
              <button onClick={sair} className="font-bold uppercase transition-colors hover:text-red-500">
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className={link}>Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
