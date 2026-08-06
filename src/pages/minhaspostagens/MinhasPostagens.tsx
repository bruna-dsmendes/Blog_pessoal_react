import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiseLoader } from 'react-spinners'
import type { PostagemResumo, StatusPostagem } from '../../models/Postagem'
import { arquivar, excluir, minhas, publicar, voltarParaRascunho } from '../../services/postagemService'
import { mensagemDeErro } from '../../services/api'
import { ToastAlerta } from '../../utils/ToastAlerta'

const FILTROS: { rotulo: string; valor?: StatusPostagem }[] = [
  { rotulo: 'Todas' },
  { rotulo: 'Rascunhos', valor: 'RASCUNHO' },
  { rotulo: 'Publicadas', valor: 'PUBLICADO' },
  { rotulo: 'Arquivadas', valor: 'ARQUIVADO' },
]

const CORES_STATUS: Record<StatusPostagem, string> = {
  RASCUNHO: 'bg-amber-100 text-amber-800',
  PUBLICADO: 'bg-emerald-100 text-emerald-800',
  ARQUIVADO: 'bg-slate-200 text-slate-600',
}

function MinhasPostagens() {

  const [postagens, setPostagens] = useState<PostagemResumo[]>([])
  const [filtro, setFiltro] = useState<StatusPostagem | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  const carregar = useCallback(async () => {
    setIsLoading(true)

    try {
      setPostagens((await minhas(filtro)).conteudo)
    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Não foi possível carregar suas postagens'), 'erro')
    } finally {
      setIsLoading(false)
    }
  }, [filtro])

  useEffect(() => { carregar() }, [carregar])

  async function executar(acao: () => Promise<unknown>, mensagem: string) {
    try {
      await acao()
      ToastAlerta(mensagem, 'sucesso')
      carregar()
    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro), 'erro')
    }
  }

  return (
    <div className="container px-8 mx-auto my-10">

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black text-slate-800">Minhas postagens</h1>

        <Link
          to="/postagens/nova"
          className="px-5 py-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600"
        >
          Nova postagem
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTROS.map(({ rotulo, valor }) => (
          <button
            key={rotulo}
            onClick={() => setFiltro(valor)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
              filtro === valor ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center my-16">
          <RiseLoader color="#5ea2df" size={24} />
        </div>
      ) : postagens.length === 0 ? (
        <p className="my-16 text-center text-slate-500">Nada por aqui ainda.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {postagens.map((postagem) => (
            <li
              key={postagem.id}
              className="flex flex-wrap items-center gap-4 p-5 bg-white border rounded-xl border-sky-100"
            >
              <div className="flex-1 min-w-60">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-full ${CORES_STATUS[postagem.status]}`}>
                    {postagem.status}
                  </span>
                  <span className="text-xs text-slate-400">{postagem.tempoLeitura} min</span>
                </div>

                <h2 className="mt-2 font-bold text-slate-800">{postagem.titulo}</h2>
                <p className="text-xs text-slate-400">/{postagem.slug}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                <Link
                  to={`/artigo/${postagem.slug}`}
                  className="px-3 py-1.5 rounded text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Ver
                </Link>

                <Link
                  to={`/postagens/${postagem.id}/editar`}
                  className="px-3 py-1.5 rounded text-sky-800 bg-sky-100 hover:bg-sky-200"
                >
                  Editar
                </Link>

                {postagem.status !== 'PUBLICADO' && (
                  <button
                    onClick={() => executar(() => publicar(postagem.id), 'Postagem publicada')}
                    className="px-3 py-1.5 rounded text-emerald-800 bg-emerald-100 hover:bg-emerald-200"
                  >
                    Publicar
                  </button>
                )}

                {postagem.status === 'PUBLICADO' && (
                  <button
                    onClick={() => executar(() => arquivar(postagem.id), 'Postagem arquivada')}
                    className="px-3 py-1.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Arquivar
                  </button>
                )}

                {postagem.status === 'ARQUIVADO' && (
                  <button
                    onClick={() => executar(() => voltarParaRascunho(postagem.id), 'Voltou para rascunho')}
                    className="px-3 py-1.5 rounded text-amber-800 bg-amber-100 hover:bg-amber-200"
                  >
                    Rascunho
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Apagar "${postagem.titulo}"? Isso não tem volta.`)) {
                      executar(() => excluir(postagem.id), 'Postagem apagada')
                    }
                  }}
                  className="px-3 py-1.5 rounded text-red-700 bg-red-50 hover:bg-red-100"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MinhasPostagens
