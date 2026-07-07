import CardTema from "../cardtema/CardTema"
import ModalTema from "../modaltema/ModalTema"
import { useNavigate } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
//import { ToastAlerta } from "../../../utils/ToastAlerta";

function ListaTemas() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [temas, setTemas] = useState<Tema[]>([])

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  useEffect(() => {
    if (token === '') {
      //ToastAlerta('Você precisa estar logado!', 'info')
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    buscarTemas()
  }, [])

  async function buscarTemas() {
    try {
      setIsLoading(true)
      await buscar('/temas', setTemas, {
        headers: { Authorization: token }
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center w-full">
      <div className="container max-w-2xl px-8">

        <div className="flex justify-between items-center py-6 border-b border-hairline">
          <h2 className="font-serif text-lg font-semibold text-ink">Temas</h2>
          <ModalTema onSuccess={buscarTemas} />
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <RiseLoader color="#5ea2df" size={12} />
          </div>
        )}

        {(!isLoading && temas.length === 0) && (
          <div className="text-center py-20">
            <span className="font-serif text-2xl text-ink-muted">
              Nenhum tema foi encontrado.
            </span>
            <p className="text-ink-faint mt-2">Que tal criar o primeiro?</p>
          </div>
        )}

        <div className="flex flex-col">
          {temas.map((tema) => (
            <CardTema key={tema.id} tema={tema} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListaTemas;