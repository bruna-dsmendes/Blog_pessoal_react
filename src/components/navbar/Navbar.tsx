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
      <div className="w-full flex justify-center py-4 bg-sky-100 text-sky-900 border-b-2 border-[#5ea2df]">

        <div className="container flex justify-between items-center text-lg mx-8">
          <Link to='/home' className="text-2xl font-bold">
            <div className="flex items-center gap-4 py-1">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-11 h-11 text-[#5ea2df] stroke-[2.5]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>

              <div className="flex flex-col justify-center">
                <span className="text-2xl font-black tracking-tight text-slate-800 leading-tight">
                  Simetria<span className="text-[#5ea2df]">.Dev</span>
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold leading-none mt-1">
                  Estudos & Resumos
                </span>
              </div>
            </div>
          </Link>

          <div className="flex gap-6 font-sans font-semibold tracking-wide text-sm uppercase text-slate-700">
            <Link to='/postagens' className='hover:text-[#5ea2df] transition-colors duration-200'>Postagens</Link>
            <Link to='/temas' className='hover:text-[#5ea2df] transition-colors duration-200'>Temas</Link>
            <Link to='/perfil' className='hover:text-[#5ea2df] transition-colors duration-200'>Perfil</Link>
            <Link to='' onClick={logout} className='hover:text-red-500 transition-colors duration-200 font-bold'>Sair</Link>
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