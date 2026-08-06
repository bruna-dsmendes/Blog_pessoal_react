import { Link, useParams } from 'react-router-dom'
import ListaPostagens from '../../components/postagem/listapostagens/ListaPostagens'

function PorTag() {

  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="my-10">
      <div className="container px-8 mx-auto">
        <Link to="/" className="text-sm font-semibold text-sky-600 hover:underline">
          ← Voltar ao feed
        </Link>

        <h1 className="mt-4 text-3xl font-black text-slate-800">
          Artigos com a tag <span className="text-sky-500">{slug}</span>
        </h1>
      </div>

      <ListaPostagens slugTag={slug} />
    </div>
  )
}

export default PorTag
