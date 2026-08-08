import { useState, type ReactNode } from 'react'
import ModalLegal, { type DocumentoLegal } from './ModalLegal'
import privacidade from '../../pages/legal/conteudo/privacidade.md?raw'
import termos from '../../pages/legal/conteudo/termos.md?raw'

const CONTEUDO: Record<DocumentoLegal, string> = {
  privacidade,
  termos,
}

interface LinkLegalProps {
  documento: DocumentoLegal
  className?: string
  children: ReactNode
}

/**
 * Abre o documento em modal, sem tirar a pessoa de onde ela está.
 *
 * As rotas /privacidade e /termos continuam existindo: documento legal precisa
 * de endereço estável para ser linkado, indexado e citado.
 */
function LinkLegal({ documento, className, children }: LinkLegalProps) {

  const [aberto, setAberto] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setAberto(true)} className={className}>
        {children}
      </button>

      {aberto && (
        <ModalLegal
          conteudo={CONTEUDO[documento]}
          rota={documento}
          aoFechar={() => setAberto(false)}
        />
      )}
    </>
  )
}

export default LinkLegal
