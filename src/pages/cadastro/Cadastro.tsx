import { useState, type ChangeEvent, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { PacmanLoader } from "react-spinners";
import type { UsuarioRequest } from "../../models/Usuario"
import { cadastrar } from "../../services/usuarioService"
import { mensagemDeErro } from "../../services/api"
import { ToastAlerta } from "../../utils/ToastAlerta";

function Cadastro() {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [confirmarSenha, setConfirmarSenha] = useState<string>("")

  const [usuario, setUsuario] = useState<UsuarioRequest>({
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  })

  function retornar() {
    navigate('/login')
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    })
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value)
  }

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (confirmarSenha === usuario.senha && usuario.senha.length >= 8) {
      setIsLoading(true)

      try {
        await cadastrar(usuario)
        ToastAlerta('Usuário cadastrado com sucesso!', 'sucesso')

        setTimeout(() => {
          navigate('/login')
        }, 500)

      } catch (error) {
        ToastAlerta(mensagemDeErro(error, 'Erro ao cadastrar o usuário!'), 'erro')
        setIsLoading(false)
      }
    } else {
      ToastAlerta('Dados do usuário inconsistentes! Verifique as informações do cadastro.', 'erro')
      setUsuario({ ...usuario, senha: '' })
      setConfirmarSenha('')
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[calc(100vh-180px)] place-items-center font-bold px-4 py-8 lg:py-0">
        <div
          className="hidden lg:block w-full h-full bg-[url('https://ik.imagekit.io/bruumendes/Gemini_Generated_Image_enmmc4enmmc4enmm.png')] bg-no-repeat bg-cover bg-center"
        ></div>

        <form className='flex justify-center items-center flex-col w-full lg:w-2/3 gap-3'
          onSubmit={cadastrarNovoUsuario}>
          <h2 className='text-sky-900 text-5xl'>Cadastrar</h2>

          <div className="flex flex-col w-full">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              className="border-2 border-sky-200 rounded p-2"
              value={usuario.nome}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuario"
              className="border-2 border-sky-200 rounded p-2"
              value={usuario.usuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="foto">Foto</label>
            <input
              type="text"
              id="foto"
              name="foto"
              placeholder="Foto"
              className="border-2 border-sky-200 rounded p-2"
              value={usuario.foto ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-sky-200 rounded p-2"
              value={usuario.senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Confirmar Senha"
              className="border-2 border-sky-200 rounded p-2"
              value={confirmarSenha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmarSenha(e)}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-around w-full gap-8">
            <button
              type='reset'
              className='rounded  bg-sky-50 hover:bg-sky-100 text-sky-900 w-1/2 py-2 border border-sky-200'
              onClick={retornar} >Cancelar</button>
            <button
              type='submit'
              className='rounded bg-sky-200 hover:bg-sky-300 text-sky-900 w-1/2 py-2 flex justify-center'
              disabled={isLoading}>

              {isLoading ?
                <PacmanLoader color="#0c4a6e" size={24} /> :
                <span> Cadastrar</span>
              }
            </button>

          </div>
        </form>
      </div>
    </>
  );
}

export default Cadastro;