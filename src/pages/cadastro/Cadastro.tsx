import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PacmanLoader } from "react-spinners";
import type Usuario from "../../models/Usuario"
import { cadastrarUsuario } from "../../services/Service"
import { ToastAlerta } from "../../utils/ToastAlerta";

const inputClass = "w-full border border-hairline rounded-md px-3.5 py-2.5 text-ink bg-paper placeholder:text-ink-faint outline-none focus:border-accent transition-colors"

function Cadastro() {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [confirmarSenha, setConfirmarSenha] = useState<string>("")

  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  })

  function retornar() {
    navigate('/')
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
        await cadastrarUsuario(`/usuarios/cadastrar`, usuario, setUsuario)
        ToastAlerta('Usuário cadastrado com sucesso!', 'sucesso')

        setTimeout(() => {
          navigate('/')
        }, 500)

      } catch (error) {
        ToastAlerta('Erro ao cadastrar o usuário!', 'erro')
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
    <div className="flex justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm">

        <h1 className="font-serif text-3xl font-semibold text-ink text-center mb-8">
          Crie sua conta
        </h1>

        <form className="flex flex-col gap-4" onSubmit={cadastrarNovoUsuario}>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-sm font-medium text-ink-soft">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Seu nome completo"
              className={inputClass}
              value={usuario.nome}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="usuario" className="text-sm font-medium text-ink-soft">E-mail</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="voce@email.com"
              className={inputClass}
              value={usuario.usuario}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="foto" className="text-sm font-medium text-ink-soft">URL da foto</label>
            <input
              type="text"
              id="foto"
              name="foto"
              placeholder="https://..."
              className={inputClass}
              value={usuario.foto}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="text-sm font-medium text-ink-soft">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Mínimo de 8 caracteres"
              className={inputClass}
              value={usuario.senha}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmarSenha" className="text-sm font-medium text-ink-soft">Confirmar senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              placeholder="Repita a senha"
              className={inputClass}
              value={confirmarSenha}
              onChange={handleConfirmarSenha}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type='button'
              className="rounded-full text-ink-soft bg-paper border border-hairline hover:bg-paper-tint w-1/2 py-2.5 transition-colors"
              onClick={retornar}>
              Cancelar
            </button>
            <button
              type='submit'
              className="rounded-full bg-accent hover:bg-accent-dark text-white font-medium w-1/2 py-2.5 flex justify-center transition-colors"
              disabled={isLoading}>
              {isLoading ? <PacmanLoader color="#ffffff" size={16} /> : <span>Cadastrar</span>}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-ink-muted mt-8">
          Já tem uma conta?{' '}
          <Link to="/" className="text-accent-dark font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
