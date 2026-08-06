import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { RiseLoader } from 'react-spinners'
import { AuthContext } from '../contexts/AuthContext'

/**
 * Espera a checagem de sessão terminar antes de decidir.
 *
 * Sem essa espera, quem recarrega uma página protegida seria jogado no login
 * por uma fração de segundo, antes de /usuarios/me responder.
 */
function RotaProtegida() {

  const { estaAutenticado, carregandoSessao } = useContext(AuthContext)
  const location = useLocation()

  if (carregandoSessao) {
    return (
      <div className="flex justify-center w-full my-24">
        <RiseLoader color="#5ea2df" size={24} />
      </div>
    )
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />
  }

  return <Outlet />
}

export default RotaProtegida
