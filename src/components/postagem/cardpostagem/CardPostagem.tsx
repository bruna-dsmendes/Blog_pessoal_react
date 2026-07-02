import { Link } from 'react-router-dom'
import type Postagem from '../../../models/Postagem'

interface CardPostagensProps {
  postagem: Postagem
}

function CardPostagem({ postagem }: CardPostagensProps) {
  return (
    <div className='border-sky-100 border 
            flex flex-col rounded overflow-hidden justify-between'>

      <div>
        <div className="flex w-full bg-sky-50 py-2 px-4 items-center gap-4 border-b border-sky-100">
          <img
            src={postagem.usuario?.foto}
            className='h-12 rounded-full'
            alt={postagem.usuario?.nome} />
          <h3 className='text-lg font-bold text-center uppercase text-sky-900'>
            {postagem.usuario?.nome}
          </h3>
        </div>
        <div className='p-4 '>
          <h4 className='text-lg font-semibold uppercase'>{postagem.titulo}</h4>
          <p>{postagem.texto}</p>
          <p>Tema: {postagem.tema?.descricao}</p>
          <p>Data: {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: 'full',
            timeStyle: 'medium',
          }).format(new Date(postagem.data))}</p>
        </div>
      </div>
      <div className="flex">
        <Link to={`/editarpostagem/${postagem.id}`}
          className='w-full text-sky-900 bg-sky-100 
17	                    hover:bg-sky-200 flex items-center justify-center py-2'>
          <button>Editar</button>
        </Link>
        <Link to=''
          className='text-sky-900 bg-red-50 
19	                    hover:bg-red-100 w-full flex items-center justify-center'>
          <button>Deletar</button>
        </Link>
      </div>
    </div>
  )
}

export default CardPostagem