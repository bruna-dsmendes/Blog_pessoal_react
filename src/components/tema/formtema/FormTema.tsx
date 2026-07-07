import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { PropagateLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormTema({ onSuccess }: { onSuccess: () => void }) {

  const navigate = useNavigate();

  const [tema, setTema] = useState<Tema>({} as Tema)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  const { id } = useParams<{ id: string }>();

  async function buscarPorId(id: string) {
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

  useEffect(() => {
    if (token === '') {
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    if (id !== undefined) {
      buscarPorId(id)
    }
  }, [id])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setTema({
      ...tema,
      [e.target.name]: e.target.value
    })
  }

  function retornar() {
    navigate("/temas")
  }

  async function gerarNovoTema(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (id !== undefined) {
      try {
        await atualizar(`/temas`, tema, setTema, {
          headers: { 'Authorization': token }
        })
        ToastAlerta('O Tema foi atualizado com sucesso!', 'sucesso')
      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout();
        } else {
          ToastAlerta('Erro ao atualizar o tema.', 'erro')
        }
      }

    } else {
      try {
        await cadastrar(`/temas`, tema, setTema, {
          headers: { 'Authorization': token }
        })
        ToastAlerta('O Tema foi cadastrado com sucesso!', 'sucesso')
        onSuccess?.()
      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout();
        } else {
          ToastAlerta('Erro ao cadastrar o tema.', 'erro')
        }
      }
    }

    setIsLoading(false)
    if (!onSuccess) retornar()
  }


  return (
    <div className="flex justify-center px-6 py-8">
      <div className="w-full">

        <h1 className="font-serif text-2xl font-semibold text-ink text-center mb-6">
          {id === undefined ? 'Novo tema' : 'Editar tema'}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={gerarNovoTema}>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="descricao" className="text-sm font-medium text-ink-soft">Descrição do tema</label>
            <input
              type="text"
              id="descricao"
              placeholder="Ex: React, Carreira, Backend..."
              name='descricao'
              className="w-full border border-hairline rounded-md px-3.5 py-2.5 text-ink bg-paper
                         placeholder:text-ink-faint outline-none focus:border-accent transition-colors"
              value={tema.descricao || ''}
              onChange={atualizarEstado}
            />
          </div>

          <button
            className="rounded-full text-white bg-accent hover:bg-accent-dark w-full py-2.5 mt-2 flex justify-center font-medium transition-colors"
            type="submit">
            {isLoading ?
              <PropagateLoader color="#ffffff" size={8} /> :
              <span>{id === undefined ? 'Criar tema' : 'Salvar'}</span>
            }
          </button>

        </form>
      </div>
    </div>
  );
}

export default FormTema;
