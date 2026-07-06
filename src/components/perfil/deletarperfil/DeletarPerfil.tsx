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
      // ToastAlerta('Você precisa estar logado', 'info')
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
    <div className='container w-1/3 mx-auto'>
      <h1 className='text-4xl text-center my-4'>Deletar Perfil</h1>
      <p className='text-center font-semibold mb-4'>
        Você tem certeza de que deseja deletar sua conta? Esta ação é irreversível!
      </p>
      <div className='border border-red-200 flex flex-col rounded-2xl overflow-hidden justify-between'>
        <header
          className='py-2 px-6 bg-red-100 text-red-900 font-bold text-2xl border-b border-red-200'>
          Dados da Conta
        </header>
        <div className='p-8 text-lg bg-white h-full text-sky-800'>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.usuario}</p>
        </div>
        <div className="flex">
          <button
            className='text-sky-900 bg-sky-200 hover:bg-sky-300 w-full py-2'
            onClick={retornar}>
            Cancelar
          </button>
          <button
            className='w-full text-white bg-red-600 hover:bg-red-700 flex items-center justify-center'
            onClick={deletarPerfil}>

            {isLoading ?
              <PacmanLoader
                color="#ffffff"
                size={24}
              /> :
              <span>Deletar Conta</span>
            }

          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarPerfil
