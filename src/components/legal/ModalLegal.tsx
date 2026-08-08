import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type DocumentoLegal = 'privacidade' | 'termos'

interface ModalLegalProps {
  conteudo: string
  rota: DocumentoLegal
  aoFechar: () => void
}

function ModalLegal({ conteudo, rota, aoFechar }: ModalLegalProps) {

  const botaoFechar = useRef<HTMLButtonElement>(null)
  const focoAnterior = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Guarda quem tinha o foco para devolver ao fechar.
    focoAnterior.current = document.activeElement as HTMLElement
    botaoFechar.current?.focus()

    // Trava a rolagem do fundo enquanto o modal está aberto.
    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') aoFechar()
    }

    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowOriginal
      focoAnterior.current?.focus()
    }
  }, [aoFechar])

  /*
   * Portal para o body: sem isso, o modal herdaria overflow e z-index de quem
   * o renderizou, o que quebra o posicionamento dentro de formulário.
   */
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={aoFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={rota === 'termos' ? 'Termos de Uso' : 'Política de Privacidade'}
        className="flex flex-col w-full max-w-2xl bg-white shadow-2xl rounded-2xl max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-sky-100">
          <Link
            to={`/${rota}`}
            onClick={aoFechar}
            className="text-sm font-semibold text-sky-600 hover:underline"
          >
            Abrir em página inteira ↗
          </Link>

          <button
            ref={botaoFechar}
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="text-2xl leading-none transition-colors text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto">
          <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-a:text-sky-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{conteudo}</ReactMarkdown>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-sky-100">
          <button
            type="button"
            onClick={aoFechar}
            className="w-full py-2.5 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ModalLegal
