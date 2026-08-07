import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { RiseLoader } from 'react-spinners'
import BotaoReacao from '../../components/postagem/reacao/BotaoReacao'
import { AuthContext } from '../../contexts/AuthContext'
import type Postagem from '../../models/Postagem'
import { porSlug } from '../../services/postagemService'

function Artigo() {

  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { usuario } = useContext(AuthContext)

  const [postagem, setPostagem] = useState<Postagem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    setIsLoading(true)

    porSlug(slug)
      .then(setPostagem)
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setIsLoading(false))
  }, [slug, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center w-full my-24">
        <RiseLoader color="#5ea2df" size={24} />
      </div>
    )
  }

  if (!postagem) return null

  const ehAutor = usuario !== null && usuario.id === postagem.autor?.id

  const data = postagem.publicadoEm
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(postagem.publicadoEm))
    : 'Não publicado'

  return (
    <article className="max-w-3xl px-6 mx-auto my-12">

      {postagem.status !== 'PUBLICADO' && (
        <p className="px-4 py-2 mb-6 text-sm font-semibold rounded bg-amber-100 text-amber-800">
          Este artigo está como {postagem.status.toLowerCase()} e não aparece no feed público.
        </p>
      )}

      <h1 className="text-4xl font-black leading-tight text-slate-800">{postagem.titulo}</h1>

      {postagem.subtitulo && (
        <p className="mt-3 text-xl text-slate-500">{postagem.subtitulo}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-6 text-sm text-slate-400">
        {postagem.autor?.foto && (
          <img src={postagem.autor.foto} alt="" className="object-cover rounded-full w-9 h-9" />
        )}
        {postagem.autor && (
          <Link to={`/autor/${postagem.autor.username}`} className="font-semibold text-slate-600 hover:text-sky-600">
            {postagem.autor.nome}
          </Link>
        )}
        <span>· {data}</span>
        <span>· {postagem.tempoLeitura} min de leitura</span>

        {ehAutor && (
          <Link
            to={`/postagens/${postagem.id}/editar`}
            className="px-3 py-1 ml-auto text-xs font-bold rounded text-sky-800 bg-sky-100 hover:bg-sky-200"
          >
            Editar
          </Link>
        )}
      </div>

      {postagem.capaUrl && (
        <img src={postagem.capaUrl} alt="" className="object-cover w-full mt-8 h-72 rounded-2xl" />
      )}

      {/*
        O react-markdown não renderiza HTML embutido por padrão, então tag
        injetada dentro do markdown vira texto em vez de virar script.
        Habilitar rehype-raw aqui abriria XSS.
      */}
      <div className="mt-10 prose prose-slate max-w-none prose-headings:font-bold prose-a:text-sky-600 prose-pre:bg-slate-900">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{postagem.conteudo}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 pt-8 mt-12 border-t border-sky-100">
        <BotaoReacao
          postagemId={postagem.id}
          totalInicial={postagem.reacoes}
          reagiInicial={postagem.reagi}
        />
        <span className="text-sm text-slate-400">
          {postagem.reacoes === 1 ? 'pessoa curtiu' : 'pessoas curtiram'}
        </span>
      </div>

      {postagem.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {postagem.tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/tag/${tag.slug}`}
              className="px-3 py-1 text-sm font-medium rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100"
            >
              {tag.nome}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}

export default Artigo
