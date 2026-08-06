import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import type { PostagemRequest } from '../../../models/Postagem'
import { atualizar, criar, porId } from '../../../services/postagemService'
import { mensagemDeErro } from '../../../services/api'
import { ToastAlerta } from '../../../utils/ToastAlerta'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MAXIMO_DE_TAGS = 5

function FormPostagem() {

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editando = id !== undefined

  const [titulo, setTitulo] = useState('')
  const [subtitulo, setSubtitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [capaUrl, setCapaUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagDigitada, setTagDigitada] = useState('')

  const [preview, setPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    porId(id)
      .then((postagem) => {
        setTitulo(postagem.titulo)
        setSubtitulo(postagem.subtitulo ?? '')
        setConteudo(postagem.conteudo)
        setCapaUrl(postagem.capaUrl ?? '')
        setTags(postagem.tags.map((tag) => tag.nome))
      })
      .catch(() => {
        ToastAlerta('Postagem não encontrada', 'erro')
        navigate('/minhas-postagens')
      })
  }, [id, navigate])

  function adicionarTag() {
    const nova = tagDigitada.trim()

    if (nova === '') return

    if (tags.length >= MAXIMO_DE_TAGS) {
      ToastAlerta(`Use no máximo ${MAXIMO_DE_TAGS} tags`, 'info')
      return
    }

    // A API deduplica pelo slug, mas evitamos o óbvio já aqui.
    if (tags.some((tag) => tag.toLowerCase() === nova.toLowerCase())) {
      setTagDigitada('')
      return
    }

    setTags([...tags, nova])
    setTagDigitada('')
  }

  function aoTeclarNaTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      adicionarTag()
    }
  }

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const dados: PostagemRequest = {
      titulo,
      subtitulo: subtitulo.trim() || null,
      conteudo,
      capaUrl: capaUrl.trim() || null,
      tags,
    }

    try {
      if (editando) {
        await atualizar(id, dados)
        ToastAlerta('Postagem atualizada', 'sucesso')
      } else {
        await criar(dados)
        ToastAlerta('Rascunho criado. Publique quando estiver pronta.', 'sucesso')
      }

      navigate('/minhas-postagens')

    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Erro ao salvar a postagem'), 'erro')
    } finally {
      setIsLoading(false)
    }
  }

  const rotuloCampo = 'text-sm font-semibold text-slate-700'
  const campo = 'border-2 border-sky-200 rounded p-2 outline-none focus:border-sky-400 transition-colors'

  return (
    <div className="max-w-3xl px-6 mx-auto my-10">
      <h1 className="mb-8 text-3xl font-black text-slate-800">
        {editando ? 'Editar postagem' : 'Nova postagem'}
      </h1>

      <form className="flex flex-col gap-5" onSubmit={salvar}>

        <div className="flex flex-col gap-1">
          <label htmlFor="titulo" className={rotuloCampo}>Título</label>
          <input
            id="titulo" className={campo} required minLength={5} maxLength={100}
            value={titulo} onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subtitulo" className={rotuloCampo}>Subtítulo</label>
          <input
            id="subtitulo" className={campo} maxLength={200}
            placeholder="A linha que aparece no card do feed"
            value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="capaUrl" className={rotuloCampo}>URL da capa</label>
          <input
            id="capaUrl" className={campo} maxLength={1000}
            placeholder="https://..."
            value={capaUrl} onChange={(e) => setCapaUrl(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tag" className={rotuloCampo}>
            Tags <span className="font-normal text-slate-400">(Enter para adicionar, até {MAXIMO_DE_TAGS})</span>
          </label>

          <div className="flex gap-2">
            <input
              id="tag" className={`${campo} flex-1`}
              placeholder="Java, Spring Boot..."
              value={tagDigitada}
              onChange={(e) => setTagDigitada(e.target.value)}
              onKeyDown={aoTeclarNaTag}
            />
            <button
              type="button" onClick={adicionarTag}
              className="px-4 font-semibold rounded text-sky-800 bg-sky-100 hover:bg-sky-200"
            >
              Adicionar
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-sky-50 text-sky-700">
                  {tag}
                  <button
                    type="button" aria-label={`Remover ${tag}`}
                    onClick={() => setTags(tags.filter((atual) => atual !== tag))}
                    className="font-bold text-sky-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="conteudo" className={rotuloCampo}>Conteúdo em markdown</label>
            <button
              type="button" onClick={() => setPreview(!preview)}
              className="text-sm font-semibold text-sky-600 hover:underline"
            >
              {preview ? 'Voltar a escrever' : 'Ver preview'}
            </button>
          </div>

          {preview ? (
            <div className="p-4 border-2 rounded border-sky-100 min-h-80 prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {conteudo || '_Nada escrito ainda._'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="conteudo" className={`${campo} font-mono text-sm min-h-80`}
              required minLength={10} maxLength={50000}
              placeholder={'# Um título\n\nTexto em **markdown**.'}
              value={conteudo} onChange={(e) => setConteudo(e.target.value)}
            />
          )}
        </div>

        <div className="flex gap-4 mt-2">
          <button
            type="button" onClick={() => navigate('/minhas-postagens')}
            className="px-6 py-2 font-semibold rounded text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            Cancelar
          </button>

          <button
            type="submit" disabled={isLoading}
            className="flex justify-center flex-1 px-6 py-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-50"
          >
            {isLoading
              ? <PropagateLoader color="#ffffff" size={12} />
              : <span>{editando ? 'Salvar alterações' : 'Salvar rascunho'}</span>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPostagem
