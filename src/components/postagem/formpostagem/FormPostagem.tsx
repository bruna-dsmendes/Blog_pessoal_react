import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import type Postagem from "../../../models/Postagem";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import type Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { PropagateLoader } from "react-spinners";

function FormPostagem() {

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
      alert('Você precisa estar logado');
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
    setPostagem({
      ...postagem,
      tema: tema,
    })
  }, [tema])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setPostagem({
      ...postagem,
      [e.target.name]: e.target.value,
      tema: tema,
      usuario: usuario,
    });

  }

  function retornar() {
    navigate('/postagens');
  }

  async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (id !== undefined) {
      try {
        await atualizar(`/postagens`, postagem, setPostagem, {
          headers: {
            Authorization: token,
          },
        });

        alert('Postagem atualizada com sucesso')

      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout()
        } else {
          alert('Erro ao atualizar a Postagem')
        }
      }
    } else {
      try {
        await cadastrar(`/postagens`, postagem, setPostagem, {
          headers: {
            Authorization: token,
          },
        })

        alert('Postagem cadastrada com sucesso');

      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout()
        } else {
          alert('Erro ao cadastrar a postagem');

        }
      }
    }

    setIsLoading(false)
    retornar()
  }

  const carregandoTema = tema.descricao === '';


  return (
    <div className="container flex flex-col mx-auto items-center">
      <h1 className="text-4xl text-center my-8">
        {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
      </h1>

      <form className="flex flex-col w-1/2 gap-4"
        onSubmit={gerarNovaPostagem}>
        <div className="flex flex-col gap-2">
          <label htmlFor="titulo" className="text-slate-700">Título da Postagem</label>
          <input
            type="text"
            placeholder="Titulo"
            name="titulo"
            required
            className="border-2 border-sky-300 rounded p-2 focus:outline-none focus:border-sky-500"
            value={postagem.titulo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="texto" className="text-slate-700">Texto da Postagem</label>
          <input
            type="text"
            placeholder="Texto"
            name="texto"
            required
            className="border-2 border-sky-300 rounded p-2 focus:outline-none focus:border-sky-500"
            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-slate-700">Tema da Postagem</p>
          <select name="tema" id="tema" className='border-2 p-2 border-sky-300 rounded focus:outline-none focus:border-sky-500'
            onChange={(e) => buscarTemaPorId(e.currentTarget.value)} >
            <option value="" selected disabled>Selecione um Tema</option>

            {temas.map((tema) => (
              <>
                <option value={tema.id} >{tema.descricao}</option>
              </>
            ))}

          </select>
        </div>

        <button
          type='submit'
          className='rounded disabled:bg-slate-200 bg-sky-400 hover:bg-sky-600 text-white font-bold w-1/2 mx-auto py-2 flex justify-center transition-colors'
          disabled={carregandoTema}
        >
          {isLoading ?
            <PropagateLoader
              color="#ffffff"
              size={24}
            /> :
            <span> {id === undefined ? 'Cadastrar' : 'Atualizar'} </span>
          }
        </button>
      </form>
    </div>
  );
}

export default FormPostagem;