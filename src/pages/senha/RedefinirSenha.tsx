import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import PainelMarca from '../../components/marca/PainelMarca'
import { redefinirSenha } from '../../services/usuarioService'
import { mensagemDeErro } from '../../services/api'
import { ToastAlerta } from '../../utils/ToastAlerta'

const TAMANHO_MINIMO = 8

function RedefinirSenha() {

  const navigate = useNavigate()
  const [parametros] = useSearchParams()
  const token = parametros.get('token') ?? ''

  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const curta = senha.length > 0 && senha.length < TAMANHO_MINIMO
  const diferentes = confirmar.length > 0 && confirmar !== senha

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (curta || diferentes) {
      return
    }

    setIsLoading(true)

    try {
      await redefinirSenha(token, senha)
      ToastAlerta('Senha alterada. Entre com a nova senha.', 'sucesso')
      navigate('/login')

    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Não foi possível redefinir a senha'), 'erro')
    } finally {
      setIsLoading(false)
    }
  }

  const campo = (temErro: boolean) =>
    `p-2.5 border-2 rounded outline-none transition-colors ${
      temErro ? 'border-red-400 focus:border-red-500' : 'border-sky-200 focus:border-[#5ea2df]'
    }`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-180px)]">

      <div className="flex items-center justify-center px-6 py-16">
        {token === '' ? (
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-black tracking-tight text-slate-800">Link inválido</h1>
            <p className="mt-4 text-slate-600">
              Esse endereço não tem um token de redefinição. Peça um link novo.
            </p>
            <Link
              to="/esqueci-a-senha"
              className="inline-block mt-6 text-sm font-bold text-sky-600 hover:underline"
            >
              Pedir novo link
            </Link>
          </div>
        ) : (
          <form className="flex flex-col w-full max-w-sm gap-5" onSubmit={salvar}>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">Nova senha</h1>
              <p className="mt-2 text-slate-500">
                Ao salvar, as sessões abertas nesta conta serão encerradas.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="senha" className="text-sm font-semibold text-slate-700">Nova senha</label>
              <input
                id="senha" type="password" required autoComplete="new-password"
                minLength={TAMANHO_MINIMO}
                placeholder={`Mínimo de ${TAMANHO_MINIMO} caracteres`}
                className={campo(curta)}
                value={senha} onChange={(e) => setSenha(e.target.value)}
              />
              {curta && (
                <span className="text-xs font-semibold text-red-500">
                  A senha precisa de pelo menos {TAMANHO_MINIMO} caracteres
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmar" className="text-sm font-semibold text-slate-700">
                Confirmar senha
              </label>
              <input
                id="confirmar" type="password" required autoComplete="new-password"
                placeholder="Repita a senha"
                className={campo(diferentes)}
                value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
              />
              {diferentes && (
                <span className="text-xs font-semibold text-red-500">As senhas não conferem</span>
              )}
            </div>

            <button
              type="submit" disabled={isLoading}
              className="flex justify-center py-3 mt-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
            >
              {isLoading ? <PropagateLoader color="#ffffff" size={12} /> : <span>Salvar nova senha</span>}
            </button>
          </form>
        )}
      </div>

      <PainelMarca />
    </div>
  )
}

export default RedefinirSenha
