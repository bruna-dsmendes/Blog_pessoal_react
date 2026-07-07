import { useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

import { AuthContext } from "../../contexts/AuthContext"

function Perfil() {
  const navigate = useNavigate()

  const { usuario } = useContext(AuthContext)

  useEffect(() => {
    if (usuario.token === "") {
      navigate("/")
    }
  }, [usuario.token])

  return (
    <div className="flex justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm text-center">

        <img
          className="w-28 h-28 rounded-full object-cover mx-auto"
          src={usuario.foto}
          alt={`Foto de perfil de ${usuario.nome}`}
        />

        <h1 className="font-serif text-3xl font-semibold text-ink mt-5">
          {usuario.nome}
        </h1>
        <p className="text-ink-muted mt-1">{usuario.usuario}</p>

        <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-hairline text-sm">
          <Link
            to="/editarperfil"
            className="text-accent-dark font-medium hover:underline"
          >
            Editar perfil
          </Link>

          <Link
            to="/deletarperfil"
            className="text-ink-faint hover:text-red-500 transition-colors"
          >
            Excluir conta
          </Link>
        </div>
      </div>
    </div>
  )

}

export default Perfil
