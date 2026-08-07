import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'

interface PaginaLegalProps {
  conteudo: string
}

/** Renderiza o documento em markdown, que fica em conteudo/ e é editado direto. */
function PaginaLegal({ conteudo }: PaginaLegalProps) {
  return (
    <article className="max-w-3xl px-6 py-12 mx-auto">
      <div className="prose prose-slate max-w-none prose-headings:font-black prose-h1:text-4xl prose-h1:tracking-tight prose-table:text-sm prose-a:text-sky-600">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{conteudo}</ReactMarkdown>
      </div>

      <div className="flex gap-6 pt-8 mt-12 text-sm font-semibold border-t border-sky-100">
        <Link to="/privacidade" className="text-sky-600 hover:underline">
          Política de Privacidade
        </Link>
        <Link to="/termos" className="text-sky-600 hover:underline">
          Termos de Uso
        </Link>
        <Link to="/" className="text-slate-500 hover:text-slate-700">
          Voltar ao feed
        </Link>
      </div>
    </article>
  )
}

export default PaginaLegal
