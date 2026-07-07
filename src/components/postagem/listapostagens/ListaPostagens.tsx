import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Postagem from "../../../models/Postagem";
import { buscar } from "../../../services/Service";
import CardPostagem from "../cardpostagem/CardPostagem";
import ModalPostagem from "../modalpostagem/ModalPostagem";
//import { ToastAlerta } from "../../../utils/ToastAlerta";

function ListaPostagens() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [postagens, setPostagens] = useState<Postagem[]>([])

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  useEffect(() => {
    if (token === '') {
      // ToastAlerta('Você precisa estar logado!', 'info')
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    buscarPostagens()
  }, [])

  async function buscarPostagens() {
    try {

      setIsLoading(true)

      await buscar('/postagens', setPostagens, {
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
    <>

      {isLoading && (
        <div className="flex justify-center w-full my-8">
          <RiseLoader
            color="#312e81"
            size={32}
          />
        </div>
      )}

      <div className="flex justify-center w-full">
        <div className="container max-w-3xl px-8">

          <div className="flex justify-between items-center py-6 border-b border-hairline">
            <h2 className="font-serif text-lg font-semibold text-ink">Últimas postagens</h2>
            <ModalPostagem onSuccess={buscarPostagens} />
          </div>

          {(!isLoading && postagens.length === 0) && (
            <div className="text-center py-20">
              <span className="font-serif text-2xl text-ink-muted">
                Nenhuma postagem foi encontrada.
              </span>
              <p className="text-ink-faint mt-2">Que tal escrever a primeira?</p>
            </div>
          )}

          <div className="flex flex-col">
            {
              postagens.map((postagem) => (
                <CardPostagem key={postagem.id} postagem={postagem} />
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
export default ListaPostagens;