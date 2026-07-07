import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import type Postagem from "../../../models/Postagem";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import type Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { PropagateLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormPostagem({ onSuccess }: { onSuccess: () => void }) {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [temas, setTemas] = useState<Tema[]>([])

  const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', })
  const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

  const { id } = useParams<{ id: string }>()

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  async function buscarPostagemPorId(id: string) {
    try {
      await buscar(`/postagens/${id}`, setPostagem, {
        headers: { Authorization: token }
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  async function buscarTemaPorId(id: string) {
    try {
      await buscar(`/temas/${id}`, setTema, {
        headers: { Authorization: token }
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  async function buscarTemas() {
    try {
      await buscar('/temas', setTemas, {
        headers: { Authorization: token }
      })
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  useEffect(() => {
    if (token === '') {
      ToastAlerta('Você precisa estar logado', 'info');
      navigate('/');
    }
  }, [token])

  useEffect(() => {
    buscarTemas()

    if (id !== undefined) {
      buscarPostagemPorId(id)
    }
  }, [id])

  useEffect(() => {
    if (tema.id !== 0) {
      setPostagem((postagemAtual) => ({
        ...postagemAtual,
        tema: tema,
      }))
    }
  }, [tema])

  useEffect(() => {
    if (postagem.tema) {
      setTema(postagem.tema)
    }
  }, [postagem.id])

  useEffect(() => {
    if (id === undefined && usuario.id !== 0) {
      setPostagem((postagemAtual) => ({
        ...postagemAtual,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          usuario: usuario.usuario,
          senha: usuario.senha,
          foto: usuario.foto,
        },
      }))
    }
  }, [id, usuario.id])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPostagem((postagemAtual) => ({
      ...postagemAtual,
      [e.target.name]: e.target.value,
    }));
  }

  function retornar() {
    navigate('/postagens');
  }

  async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const payload = {
      ...postagem,
      tema: postagem.tema ? { id: postagem.tema.id, descricao: postagem.tema.descricao } : null,
      usuario: postagem.usuario ? {
        id: postagem.usuario.id,
        nome: postagem.usuario.nome,
        usuario: postagem.usuario.usuario,
        senha: postagem.usuario.senha,
        foto: postagem.usuario.foto,
      } : null,
    }

    if (id !== undefined) {
      try {
        await atualizar(`/postagens`, payload, setPostagem, {
          headers: {
            Authorization: token,
          },
        });

        ToastAlerta('Postagem atualizada com sucesso', 'sucesso')

      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout()
        } else {
          ToastAlerta('Erro ao atualizar a Postagem', 'erro')
        }
      }
    } else {
      try {
        await cadastrar(`/postagens`, payload, setPostagem, {
          headers: {
            Authorization: token,
          },
        })

        ToastAlerta('Postagem cadastrada com sucesso', 'sucesso')
        onSuccess?.()

      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout()
        } else {
          ToastAlerta('Erro ao cadastrar a postagem', 'erro');

        }
      }
    }

    setIsLoading(false)
    if (!onSuccess) retornar()
  }

  const carregandoTema = !tema.descricao;

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        <h1 className="font-serif text-2xl font-semibold text-ink mb-6">
          {id !== undefined ? 'Editar postagem' : 'Nova postagem'}
        </h1>

        <form className="flex flex-col" onSubmit={gerarNovaPostagem}>

          <input
            type="text"
            placeholder="Título"
            name="titulo"
            required
            className="w-full font-serif text-3xl md:text-4xl font-bold text-ink placeholder:text-ink-faint
                       outline-none border-none bg-transparent py-2"
            value={postagem.titulo || ''}
            onChange={atualizarEstado}
          />

          <textarea
            placeholder="Conte sua história..."
            name="texto"
            required
            rows={16}
            className="w-full font-serif text-lg text-ink-soft placeholder:text-ink-faint
                       outline-none border-none bg-transparent leading-relaxed
                       py-3 mt-1 resize-y min-h-[420px]"
            value={postagem.texto || ''}
            onChange={atualizarEstado}
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-5 border-t border-hairline">

            <div className="flex items-center gap-2">
              <label htmlFor="tema" className="text-sm text-ink-muted">Tema</label>
              <select
                name="tema"
                id="tema"
                className="border border-hairline rounded-full px-3.5 py-1.5 text-sm text-ink bg-paper
                           outline-none focus:border-accent transition-colors"
                value={tema.id || ''}
                onChange={(e) => buscarTemaPorId(e.currentTarget.value)}
              >
                <option value="" disabled>Selecione</option>
                {temas.map((tema) => (
                  <option key={tema.id} value={tema.id}>{tema.descricao}</option>
                ))}
              </select>
            </div>

            <button
              type='submit'
              className="rounded-full disabled:bg-ink-faint disabled:cursor-not-allowed bg-accent hover:bg-accent-dark
                         text-white font-medium px-6 py-2 flex justify-center items-center transition-colors"
              disabled={carregandoTema}
            >
              {isLoading ?
                <PropagateLoader color="#ffffff" size={8} /> :
                <span>{id === undefined ? 'Publicar' : 'Salvar'}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPostagem;
