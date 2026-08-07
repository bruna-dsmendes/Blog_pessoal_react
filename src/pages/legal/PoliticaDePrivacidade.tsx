import PaginaLegal from './PaginaLegal'
import conteudo from './conteudo/privacidade.md?raw'

function PoliticaDePrivacidade() {
  return <PaginaLegal conteudo={conteudo} />
}

export default PoliticaDePrivacidade
