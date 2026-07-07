import { Link } from 'react-router-dom'
import type Postagem from '../../../models/Postagem'

interface CardPostagensProps {
  postagem: Postagem
}

function CardPostagem({ postagem }: CardPostagensProps) {

  const tempoLeitura = Math.max(1, Math.round((postagem.texto?.split(/\s+/).length || 0) / 200))

  return (
    <article className="py-6 border-b border-hairline group">

      <div className="flex items-center gap-2 mb-2">
        <img
          src={postagem.usuario?.foto}
          className="h-6 w-6 rounded-full object-cover"
          alt={postagem.usuario?.nome}
        />
        <span className="text-sm text-ink-soft font-medium">{postagem.usuario?.nome}</span>
        <span className="text-ink-faint text-sm">·</span>
        <span className="text-sm text-ink-faint">
          {new Intl.DateTimeFormat("pt-BR", { day: '2-digit', month: 'short' }).format(new Date(postagem.data))}
        </span>
      </div>

      <Link to={`/postagem/${postagem.id}`} className="block">
        <h3 className="font-serif text-2xl font-bold text-ink leading-snug group-hover:text-accent-dark transition-colors">
          {postagem.titulo}
        </h3>
        <p className="text-ink-muted mt-1.5 leading-relaxed line-clamp-2">
          {postagem.texto}
        </p>
      </Link>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          {postagem.tema?.descricao && (
            <span className="text-xs font-medium text-accent-dark bg-accent-tint rounded-full px-3 py-1">
              {postagem.tema.descricao}
            </span>
          )}
          <span className="text-xs text-ink-faint">{tempoLeitura} min de leitura</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link to={`/editarpostagem/${postagem.id}`} className="text-ink-faint hover:text-accent-dark transition-colors">
            Editar
          </Link>
          <Link to={`/deletarpostagem/${postagem.id}`} className="text-ink-faint hover:text-red-500 transition-colors">
            Excluir
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CardPostagem
