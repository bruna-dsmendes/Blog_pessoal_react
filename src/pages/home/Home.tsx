import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiseLoader } from 'react-spinners'
import CardPostagem from '../../components/postagem/cardpostagem/CardPostagem'
import type { PostagemResumo } from '../../models/Postagem'
import type Tag from '../../models/Tag'
import { feed } from '../../services/postagemService'
import { listar } from '../../services/tagService'
import { daPlataforma, type Estatisticas } from '../../services/estatisticaService'

/*
 * Abaixo disso, número em destaque comunica o contrário do que se quer: chama
 * atenção para o vazio. O bloco de estatísticas só aparece quando a plataforma
 * tem volume que justifique.
 */
const ARTIGOS_PARA_MOSTRAR_NUMEROS = 10

function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="p-6 text-center bg-white border shadow-sm rounded-2xl border-sky-100">
      <span className="block text-3xl font-black tracking-tight text-slate-800">{valor}</span>
      <span className="block mt-1 font-mono text-xs font-bold tracking-wider uppercase text-slate-400">
        {rotulo}
      </span>
    </div>
  )
}

function Destaque({ postagem }: { postagem: PostagemResumo }) {
  return (
    <Link
      to={`/artigo/${postagem.slug}`}
      className="grid overflow-hidden transition-shadow bg-white border md:grid-cols-2 rounded-2xl border-sky-100 hover:shadow-lg"
    >
      {postagem.capaUrl ? (
        <img src={postagem.capaUrl} alt="" className="object-cover w-full h-full min-h-56" />
      ) : (
        <div className="min-h-56 bg-gradient-to-br from-sky-100 to-sky-200" />
      )}

      <div className="flex flex-col justify-center gap-3 p-8">
        <span className="font-mono text-xs font-bold tracking-wider uppercase text-sky-600">
          Último publicado
        </span>

        <h2 className="text-2xl font-black leading-tight text-slate-800">{postagem.titulo}</h2>

        {postagem.subtitulo && (
          <p className="text-slate-500 line-clamp-3">{postagem.subtitulo}</p>
        )}

        <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
          <span className="font-semibold text-slate-600">{postagem.autor?.nome}</span>
          <span>· {postagem.tempoLeitura} min de leitura</span>
        </div>
      </div>
    </Link>
  )
}

function Home() {

  const [postagens, setPostagens] = useState<PostagemResumo[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([feed(0, 7), listar(0, 12), daPlataforma()])
      .then(([pagina, paginaTags, numeros]) => {
        setPostagens(pagina.conteudo)
        setTags(paginaTags.conteudo)
        setEstatisticas(numeros)
      })
      .catch(() => { /* a tela funciona vazia; o erro não vale um alerta na home */ })
      .finally(() => setIsLoading(false))
  }, [])

  const [destaque, ...demais] = postagens

  const horas = estatisticas ? Math.round(estatisticas.minutosDeConteudo / 60) : 0

  const mostrarNumeros =
    estatisticas !== null && estatisticas.artigosPublicados >= ARTIGOS_PARA_MOSTRAR_NUMEROS

  return (
    <>
      <section className="pb-16 border-b bg-sky-100 border-sky-200">
        <div className="container px-8 py-16 mx-auto">
          <h1 className="text-6xl font-black leading-none tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-slate-800 via-[#5ea2df] to-sky-600 bg-clip-text text-transparent">
              Simetria Dev
            </span>
          </h1>

          <p className="max-w-xl mt-6 text-xl font-medium leading-relaxed text-slate-600">
            O espaço para simplificar conteúdos extensos e organizar nossa jornada tech em grupo.
            Faça o seu
            <span className="text-[#5ea2df] font-mono font-bold"> &lt;registro de aprendizado/&gt;</span>.
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="px-3 py-1.5 text-sm font-semibold transition-colors bg-white border rounded-full border-sky-200 text-sky-800 hover:bg-sky-50"
                >
                  {tag.nome}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {mostrarNumeros && (
        <div className="container relative z-10 px-8 mx-auto -mt-10">
          <div className="grid max-w-4xl grid-cols-2 gap-6 mx-auto md:grid-cols-4">
            <Numero valor={String(estatisticas.artigosPublicados)} rotulo="artigos" />
            <Numero valor={String(estatisticas.autores)} rotulo="autores" />
            <Numero valor={String(estatisticas.tags)} rotulo="temas" />
            <Numero valor={horas > 0 ? `${horas}h` : `${estatisticas.minutosDeConteudo}min`} rotulo="de leitura" />
          </div>
        </div>
      )}

      <div className="container px-8 mx-auto my-12">
        {isLoading ? (
          <div className="flex justify-center my-16">
            <RiseLoader color="#5ea2df" size={24} />
          </div>
        ) : postagens.length === 0 ? (
          <p className="my-16 text-center text-slate-500">
            Nenhum artigo publicado ainda. Que tal ser a primeira pessoa?
          </p>
        ) : (
          <>
            <Destaque postagem={destaque} />

            {demais.length > 0 && (
              <>
                <h2 className="mt-16 mb-6 text-xl font-bold text-slate-800">Publicados recentemente</h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {demais.map((postagem) => (
                    <CardPostagem key={postagem.id} postagem={postagem} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Home
