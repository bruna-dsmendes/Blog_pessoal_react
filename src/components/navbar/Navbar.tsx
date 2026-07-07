import { Link, useNavigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";

function Navbar() {

  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext)

  function logout() {
    handleLogout()
    ToastAlerta('O usuário foi desconectado com sucesso!', 'info')
    navigate('/')
  }

  let component: ReactNode

  if (usuario.token !== "") {
    component = (
      <div className="w-full flex justify-center bg-paper border-b border-hairline sticky top-0 z-20">

        <div className="container flex justify-between items-center h-16 mx-8">
          <Link to='/home' className="flex items-center gap-2.5 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 text-accent stroke-[2.5]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span className="font-serif text-xl font-semibold tracking-tight text-ink">
              Simetria<span className="text-accent">.Dev</span>
            </span>
          </Link>

          <div className="flex items-center gap-7 font-sans text-[15px] text-ink-soft">
            <Link to='/postagens' className='hover:text-ink transition-colors duration-150'>Postagens</Link>
            <Link to='/temas' className='hover:text-ink transition-colors duration-150'>Temas</Link>

            <Link
              to='/cadastrarpostagem'
              className='hidden sm:flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-150'
            >
              Escrever
            </Link>

            <Link to='/perfil' className="shrink-0">
              <img
                src={usuario.foto || '/favicon.svg'}
                alt={usuario.nome}
                className="w-8 h-8 rounded-full object-cover border border-hairline"
              />
            </Link>

            <button
              onClick={logout}
              className='text-ink-muted hover:text-ink transition-colors duration-150 text-sm'
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      {component}
    </>
  )
}

export default Navbar;