import { Link } from 'react-router-dom'
import type Tema from '../../../models/Tema'

interface CardTemaProps {
  tema: Tema
}

function CardTema({ tema }: CardTemaProps) {
  return (
    <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
      <header className='py-2 px-6 bg-[#00b7eb] text-white font-bold text-2xl'>Tema</header>
      <p className='p-8 text-3xl bg-pink-50 h-full'>{tema.descricao}</p>

      <div className="flex">
        <Link to={`/editartema/${tema.id}`}
          className='w-full text-slate-100 bg-pink-300 hover:bg-pink-600 flex
         items-center justify-center py-2'>
          <button>Editar</button>
        </Link>

        <Link to='' className='text-slate-100 bg-[#00B7EB] hover:bg-red-700 w-full
                    flex items-center justify-center'>
          <button>Deletar</button>
        </Link>
      </div>

    </div>
  )
}

export default CardTema