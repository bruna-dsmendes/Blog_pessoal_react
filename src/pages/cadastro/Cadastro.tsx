import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PropagateLoader } from "react-spinners"
import PainelMarca from "../../components/marca/PainelMarca"
import type { UsuarioRequest } from "../../models/Usuario"
import { cadastrar } from "../../services/usuarioService"
import { mensagemDeErro } from "../../services/api"
import { ToastAlerta } from "../../utils/ToastAlerta"

const TAMANHO_MINIMO_DA_SENHA = 8

function Cadastro() {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [usuario, setUsuario] = useState<UsuarioRequest>({
    nome: '',
    usuario: '',
    senha: '',
    foto: ''
  })

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({ ...usuario, [e.target.name]: e.target.value })
  }

  const senhaCurta = usuario.senha.length > 0 && usuario.senha.length < TAMANHO_MINIMO_DA_SENHA
  const senhasDiferentes = confirmarSenha.length > 0 && confirmarSenha !== usuario.senha

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (senhaCurta || senhasDiferentes) {
      ToastAlerta('Verifique a senha antes de continuar', 'erro')
      return
    }

    setIsLoading(true)

    try {
      await cadastrar(usuario)
      ToastAlerta('Conta criada! Agora é só entrar.', 'sucesso')
      navigate('/login')

    } catch (error) {
      ToastAlerta(mensagemDeErro(error, 'Erro ao cadastrar o usuário'), 'erro')
      setUsuario({ ...usuario, senha: '' })
      setConfirmarSenha('')
    } finally {
      setIsLoading(false)
    }
  }

  const campo = (temErro = false) =>
    `border-2 rounded p-2.5 outline-none transition-colors ${
      temErro ? 'border-red-400 focus:border-red-500' : 'border-sky-200 focus:border-[#5ea2df]'
    }`

  const rotulo = 'text-sm font-semibold text-slate-700'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-180px)]">

      <PainelMarca />

      <div className="flex items-center justify-center px-6 py-16">
        <form className="flex flex-col w-full max-w-sm gap-4" onSubmit={cadastrarNovoUsuario}>

          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">Criar conta</h1>
            <p className="mt-2 text-slate-500">Leva menos de um minuto.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className={rotulo}>Nome</label>
            <input
              type="text" id="nome" name="nome" required minLength={2}
              placeholder="Como você quer ser chamada"
              autoComplete="name"
              className={campo()}
              value={usuario.nome}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="usuario" className={rotulo}>E-mail</label>
            <input
              type="email" id="usuario" name="usuario" required
              placeholder="voce@email.com"
              autoComplete="email"
              className={campo()}
              value={usuario.usuario}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="foto" className={rotulo}>
              Foto <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <input
              type="url" id="foto" name="foto"
              placeholder="https://..."
              className={campo()}
              value={usuario.foto ?? ''}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className={rotulo}>Senha</label>
            <input
              type="password" id="senha" name="senha" required minLength={TAMANHO_MINIMO_DA_SENHA}
              placeholder={`Mínimo de ${TAMANHO_MINIMO_DA_SENHA} caracteres`}
              autoComplete="new-password"
              className={campo(senhaCurta)}
              value={usuario.senha}
              onChange={atualizarEstado}
            />
            {senhaCurta && (
              <span className="text-xs font-semibold text-red-500">
                A senha precisa de pelo menos {TAMANHO_MINIMO_DA_SENHA} caracteres
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmarSenha" className={rotulo}>Confirmar senha</label>
            <input
              type="password" id="confirmarSenha" required
              placeholder="Repita a senha"
              autoComplete="new-password"
              className={campo(senhasDiferentes)}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            {senhasDiferentes && (
              <span className="text-xs font-semibold text-red-500">As senhas não conferem</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center py-3 mt-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
          >
            {isLoading ? <PropagateLoader color="#ffffff" size={12} /> : <span>Criar conta</span>}
          </button>

          <p className="text-sm text-center text-slate-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-bold text-sky-600 hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Cadastro
