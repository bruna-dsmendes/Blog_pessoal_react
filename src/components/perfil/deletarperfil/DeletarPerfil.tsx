import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { deletar } from "../../../services/Service";
import { PacmanLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function DeletarPerfil() {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  useEffect(() => {
    if (token === '') {
      navigate('/')
    }
  }, [token])

  async function deletarPerfil() {
    setIsLoading(true)

    try {
      await deletar(`/usuarios/${usuario.id}`, {
        headers: {
          'Authorization': token
        }
      })

      ToastAlerta('Perfil deletado com sucesso', 'sucesso')
      handleLogout()

      setTimeout(() => {
        navigate('/')
      }, 500)

    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      } else {
        ToastAlerta('Erro ao deletar o perfil.', 'erro')
      }
      setIsLoading(false)
    }
  }

  function retornar() {
    navigate("/perfil")
  }

  return (
    <div className="flex justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm">

        <h1 className="font-serif text-3xl font-semibold text-ink text-center mb-3">
          Excluir conta
        </h1>
        <p className="text-center text-ink-muted mb-8">
          Essa ação é permanente. Tem certeza de que deseja excluir sua conta?
        </p>

        <div className="border border-hairline rounded-md p-5 mb-6">
          <p className="text-ink font-medium">{usuario.nome}</p>
          <p className="text-ink-muted text-sm mt-0.5">{usuario.usuario}</p>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-full text-ink-soft bg-paper border border-hairline hover:bg-paper-tint w-1/2 py-2.5 transition-colors"
            onClick={retornar}>
            Cancelar
          </button>
          <button
            className="rounded-full text-white bg-red-500 hover:bg-red-600 w-1/2 py-2.5 flex justify-center font-medium transition-colors"
            onClick={deletarPerfil}>
            {isLoading ? <PacmanLoader color="#ffffff" size={16} /> : <span>Excluir conta</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarPerfil
