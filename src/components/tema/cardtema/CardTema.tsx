import { Link } from 'react-router-dom'
import type Tema from '../../../models/Tema'

interface CardTemaProps {
  tema: Tema
}

function CardTema({ tema }: CardTemaProps) {
  return (
    <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
      <header className='py-2 px-6 bg-sky-100 text-sky-900 font-bold text-2xl border-b border-sky-200'>Tema</header>
      <p className='p-8 text-3xl bg-white h-full text-sky-800'>{tema.descricao}</p>

      <div className="flex">
        <Link to={`/editartema/${tema.id}`}
          className='w-full text-sky-900 bg-sky-100 hover:bg-sky-200 flex
         items-center justify-center py-2'>
          <button>Editar</button>
        </Link>

        <Link to={`/deletartema/${tema.id}`}
          className='text-sky-900 bg-red-50 hover:bg-red-100 w-full flex items-center justify-center'>
          <button>Deletar</button>
        </Link>
      </div>

    </div>
  )
}

export default CardTema