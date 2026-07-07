import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PulseLoader } from "react-spinners"
import { AuthContext } from "../../contexts/AuthContext"
import type Postagem from "../../models/Postagem"
import { buscar } from "../../services/Service"

function LeituraPostagem() {

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  async function buscarPorId(id: string) {
    setIsLoading(true)
    try {
      await buscar(`/postagens/${id}`, setPostagem, {
        headers: { 'Authorization': token }
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
    setIsLoading(false)
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

  const tempoLeitura = Math.max(1, Math.round((postagem.texto?.split(/\s+/).length || 0) / 200))
  const autorDaPostagem = postagem.usuario?.id === usuario.id

  return (
    <div className="flex justify-center w-full">

      {isLoading && (
        <div className="flex w-full justify-center py-24">
          <PulseLoader color="#5ea2df" size={12} />
        </div>
      )}

      {(!isLoading && postagem.id) && (
        <article className="container max-w-2xl px-8 py-12">

          {postagem.tema?.descricao && (
            <span className="text-xs font-medium text-accent-dark bg-accent-tint rounded-full px-3 py-1">
              {postagem.tema.descricao}
            </span>
          )}

          <h1 className="font-serif text-3xl md:text-[2.6rem] font-bold text-ink leading-tight mt-4">
            {postagem.titulo}
          </h1>

          <div className="flex items-center justify-between mt-6 pb-6 border-b border-hairline">
            <div className="flex items-center gap-3">
              <img
                src={postagem.usuario?.foto}
                alt={postagem.usuario?.nome}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="text-ink font-medium text-sm">{postagem.usuario?.nome}</p>
                <p className="text-ink-faint text-sm">
                  {new Intl.DateTimeFormat("pt-BR", { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(postagem.data))}
                  {" · "}{tempoLeitura} min de leitura
                </p>
              </div>
            </div>

            {autorDaPostagem && (
              <div className="flex items-center gap-4 text-sm shrink-0">
                <Link to={`/editarpostagem/${postagem.id}`} className="text-ink-faint hover:text-accent-dark transition-colors">
                  Editar
                </Link>
                <Link to={`/deletarpostagem/${postagem.id}`} className="text-ink-faint hover:text-red-500 transition-colors">
                  Excluir
                </Link>
              </div>
            )}
          </div>

          <div className="font-serif text-lg text-ink-soft leading-[1.85] mt-8 whitespace-pre-wrap">
            {postagem.texto}
          </div>

          <div className="mt-14 pt-6 border-t border-hairline">
            <Link to="/home" className="text-sm text-ink-muted hover:text-ink transition-colors">
              ← Voltar para o feed
            </Link>
          </div>
        </article>
      )}
    </div>
  )
}

export default LeituraPostagem
