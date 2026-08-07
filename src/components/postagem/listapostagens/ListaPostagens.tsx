import { useCallback, useEffect, useState } from 'react'
import { RiseLoader } from 'react-spinners'
import type Pagina from '../../../models/Pagina'
import type { PostagemResumo } from '../../../models/Postagem'
import { feed, porAutor, porTag } from '../../../services/postagemService'
import { mensagemDeErro } from '../../../services/api'
import { ToastAlerta } from '../../../utils/ToastAlerta'
import CardPostagem from '../cardpostagem/CardPostagem'

interface ListaPostagensProps {
  /** Quando presente, lista só as postagens dessa tag. */
  slugTag?: string
  /** Quando presente, lista só os artigos publicados desse autor. */
  username?: string
}

function ListaPostagens({ slugTag, username }: ListaPostagensProps) {

  const [pagina, setPagina] = useState<Pagina<PostagemResumo> | null>(null)
  const [numero, setNumero] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const carregar = useCallback(async () => {
    setIsLoading(true)

    try {
      if (username) {
        setPagina(await porAutor(username, numero))
      } else if (slugTag) {
        setPagina(await porTag(slugTag, numero))
      } else {
        setPagina(await feed(numero))
      }
    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Não foi possível carregar as postagens'), 'erro')
    } finally {
      setIsLoading(false)
    }
  }, [slugTag, username, numero])

  useEffect(() => { carregar() }, [carregar])

  // Trocar de filtro precisa voltar para a primeira página.
  useEffect(() => { setNumero(0) }, [slugTag, username])

  if (isLoading && !pagina) {
    return (
      <div className="flex justify-center w-full my-16">
        <RiseLoader color="#5ea2df" size={24} />
      </div>
    )
  }

  const postagens = pagina?.conteudo ?? []

  return (
    <section className="container mx-auto px-8 my-8">
      {postagens.length === 0 ? (
        <p className="my-16 text-center text-slate-500">
          Nenhuma postagem publicada por aqui ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postagens.map((postagem) => (
            <CardPostagem key={postagem.id} postagem={postagem} />
          ))}
        </div>
      )}

      {pagina && pagina.totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setNumero((n) => n - 1)}
            disabled={pagina.primeira || isLoading}
            className="px-4 py-2 text-sm font-semibold transition-colors rounded text-sky-800 bg-sky-100 hover:bg-sky-200 disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-sm text-slate-500">
            Página {pagina.pagina + 1} de {pagina.totalPaginas}
          </span>

          <button
            onClick={() => setNumero((n) => n + 1)}
            disabled={pagina.ultima || isLoading}
            className="px-4 py-2 text-sm font-semibold transition-colors rounded text-sky-800 bg-sky-100 hover:bg-sky-200 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  )
}

export default ListaPostagens
