import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import type Postagem from "../../../models/Postagem"
import { buscar, deletar } from "../../../services/Service"
import { PacmanLoader } from "react-spinners"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function DeletarPostagem() {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

  const { id } = useParams<{ id: string }>()

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  async function buscarPorId(id: string) {
    try {
      await buscar(`/postagens/${id}`, setPostagem, {
        headers: {
          'Authorization': token
        }
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  useEffect(() => {
    if (token === '') {
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    if (id !== undefined) {
      buscarPorId(id)
    }
  }, [id])

  async function deletarPostagem() {
    setIsLoading(true)

    try {
      await deletar(`/postagens/${id}`, {
        headers: {
          'Authorization': token
        }
      })

      ToastAlerta('Postagem apagada com sucesso', 'sucesso')

    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      } else {
        ToastAlerta('Erro ao deletar a postagem.', 'erro')
      }
    }

    setIsLoading(false)
    retornar()
  }

  function retornar() {
    navigate("/postagens")
  }

  return (
    <div className="flex justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm">

        <h1 className="font-serif text-3xl font-semibold text-ink text-center mb-3">
          Excluir postagem
        </h1>
        <p className="text-center text-ink-muted mb-8">
          Essa ação é permanente. Tem certeza de que deseja excluir esta postagem?
        </p>

        <div className="border border-hairline rounded-md p-5 mb-6">
          <p className="font-serif text-lg font-semibold text-ink leading-snug">{postagem.titulo}</p>
          <p className="text-ink-muted text-sm mt-1.5 line-clamp-2">{postagem.texto}</p>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-full text-ink-soft bg-paper border border-hairline hover:bg-paper-tint w-1/2 py-2.5 transition-colors"
            onClick={retornar}>
            Cancelar
          </button>
          <button
            className="rounded-full text-white bg-red-500 hover:bg-red-600 w-1/2 py-2.5 flex items-center justify-center font-medium transition-colors"
            onClick={deletarPostagem}>
            {isLoading ? <PacmanLoader color="#ffffff" size={16} /> : <span>Excluir</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarPostagem
