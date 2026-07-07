import { Link } from 'react-router-dom'
import type Tema from '../../../models/Tema'

interface CardTemaProps {
  tema: Tema
}

function CardTema({ tema }: CardTemaProps) {
  return (
    <div className='flex items-center justify-between py-4 border-b border-hairline'>
      <span className='text-sm font-medium text-accent-dark bg-accent-tint rounded-full px-3.5 py-1.5'>
        {tema.descricao}
      </span>

      <div className="flex items-center gap-4 text-sm">
        <Link to={`/editartema/${tema.id}`} className='text-ink-faint hover:text-accent-dark transition-colors'>
          Editar
        </Link>
        <Link to={`/deletartema/${tema.id}`} className='text-ink-faint hover:text-red-500 transition-colors'>
          Excluir
        </Link>
      </div>
    </div>
  )
}

export default CardTema
