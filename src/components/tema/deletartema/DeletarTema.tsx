import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar, deletar } from "../../../services/Service";
import { PacmanLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function DeletarTema() {

  const navigate = useNavigate()

  const [tema, setTema] = useState<Tema>({} as Tema)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  const { id } = useParams<{ id: string }>()

  async function buscarPorId(id: string) {
    try {
      await buscar(`/temas/${id}`, setTema, {
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

  async function deletarTema() {
    setIsLoading(true)

    try {
      await deletar(`/temas/${id}`, {
        headers: {
          'Authorization': token
        }
      })

      ToastAlerta('Tema apagado com sucesso', 'sucesso')

    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      } else {
        ToastAlerta('Erro ao deletar o tema.', 'erro')
      }
    }

    setIsLoading(false)
    retornar()
  }

  function retornar() {
    navigate("/temas")
  }

  return (
    <div className="flex justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm">

        <h1 className="font-serif text-3xl font-semibold text-ink text-center mb-3">
          Excluir tema
        </h1>
        <p className="text-center text-ink-muted mb-8">
          Tem certeza de que deseja excluir este tema? Postagens associadas podem ser afetadas.
        </p>

        <div className="border border-hairline rounded-md p-5 mb-6 flex justify-center">
          <span className="text-sm font-medium text-accent-dark bg-accent-tint rounded-full px-3.5 py-1.5">
            {tema.descricao}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-full text-ink-soft bg-paper border border-hairline hover:bg-paper-tint w-1/2 py-2.5 transition-colors"
            onClick={retornar}>
            Cancelar
          </button>
          <button
            className="rounded-full text-white bg-red-500 hover:bg-red-600 w-1/2 py-2.5 flex items-center justify-center font-medium transition-colors"
            onClick={deletarTema}>
            {isLoading ? <PacmanLoader color="#ffffff" size={16} /> : <span>Excluir</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarTema
