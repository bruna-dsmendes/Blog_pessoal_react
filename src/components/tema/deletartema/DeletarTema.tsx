import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar, deletar } from "../../../services/Service";
import { ClipLoader } from "react-spinners";

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
      alert('Você precisa estar logado')
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

      alert('Tema apagado com sucesso')

    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      } else {
        alert('Erro ao deletar o tema.')
      }
    }

    setIsLoading(false)
    retornar()
  }

  function retornar() {
    navigate("/temas")
  }

  return (
    <div className='container w-1/3 mx-auto'>
      <h1 className='text-4xl text-center my-4'>Deletar tema</h1>
      <p className='text-center font-semibold mb-4'>
        Você tem certeza de que deseja apagar o tema a seguir?
      </p>
      <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
        <header
          className='py-2 px-6 bg-sky-100 text-sky-900 font-bold text-2xl border-b border-sky-200'>
          Tema
        </header>
        <p className='p-8 text-3xl bg-white h-full text-sky-800'>{tema.descricao}</p>
        <div className="flex">
          <button
            className='text-sky-900 bg-sky-50 hover:bg-sky-100 w-full py-2 border-r border-sky-200'
            onClick={retornar}>
            Não
          </button>
          <button
            className='w-full text-sky-900 bg-sky-200 
96	                        hover:bg-sky-300 flex items-center justify-center'
            onClick={deletarTema}>

            {isLoading ?
              <ClipLoader
                color="#0c4a6e"
                size={24}
              /> :
              <span>Sim</span>
            }

          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarTema