import { Link } from 'react-router-dom'
import type { PostagemResumo } from '../../../models/Postagem'

const ROTULO_STATUS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  ARQUIVADO: 'Arquivado',
}

function formatarData(data: string | null) {
  if (!data) return null

  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(data))
}

function CardPostagem({ postagem }: { postagem: PostagemResumo }) {

  const data = formatarData(postagem.publicadoEm ?? postagem.atualizadoEm)
  const rotulo = ROTULO_STATUS[postagem.status]

  return (
    <article className="flex flex-col justify-between overflow-hidden transition-shadow bg-white border rounded-2xl border-sky-100 hover:shadow-md">

      <Link to={`/artigo/${postagem.slug}`} className="flex flex-col">
        {postagem.capaUrl && (
          <img src={postagem.capaUrl} alt="" className="object-cover w-full h-40" />
        )}

        <div className="flex flex-col gap-2 p-5">
          {rotulo && (
            <span className="self-start px-2 py-0.5 text-xs font-bold uppercase rounded-full bg-amber-100 text-amber-800">
              {rotulo}
            </span>
          )}

          <h3 className="text-lg font-bold leading-snug text-slate-800">{postagem.titulo}</h3>

          {postagem.subtitulo && (
            <p className="text-sm text-slate-500 line-clamp-2">{postagem.subtitulo}</p>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-3 px-5 pb-5">
        {postagem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {postagem.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100"
              >
                {tag.nome}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {postagem.autor?.foto && (
            <img src={postagem.autor.foto} alt="" className="object-cover w-6 h-6 rounded-full" />
          )}
          <span className="font-semibold text-slate-600">{postagem.autor?.nome ?? 'Autor removido'}</span>
          {data && <span>· {data}</span>}
          <span>· {postagem.tempoLeitura} min de leitura</span>
        </div>
      </div>
    </article>
  )
}

export default CardPostagem
