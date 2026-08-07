import PaginaLegal from './PaginaLegal'
import conteudo from './conteudo/termos.md?raw'

function TermosDeUso() {
  return <PaginaLegal conteudo={conteudo} />
}

export default TermosDeUso
