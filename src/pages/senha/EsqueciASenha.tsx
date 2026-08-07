import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import PainelMarca from '../../components/marca/PainelMarca'
import { esqueciASenha } from '../../services/usuarioService'

function EsqueciASenha() {

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function solicitar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await esqueciASenha(email)
    } catch {
      /*
       * A confirmação aparece mesmo se a requisição falhar. Reagir diferente
       * conforme o resultado revelaria quem tem conta na plataforma.
       */
    } finally {
      setEnviado(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-180px)]">

      <div className="flex items-center justify-center px-6 py-16">
        {enviado ? (
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-black tracking-tight text-slate-800">Confira seu e-mail</h1>

            <p className="mt-4 leading-relaxed text-slate-600">
              Se existir uma conta com <strong>{email}</strong>, o link para criar uma
              nova senha chega em instantes. Ele vale por 30 minutos.
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Não recebeu? Veja a caixa de spam, ou{' '}
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="font-semibold text-sky-600 hover:underline"
              >
                tente outro endereço
              </button>.
            </p>

            <Link to="/login" className="inline-block mt-8 text-sm font-bold text-sky-600 hover:underline">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form className="flex flex-col w-full max-w-sm gap-5" onSubmit={solicitar}>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800">Esqueci a senha</h1>
              <p className="mt-2 text-slate-500">
                Informe o e-mail da conta e enviaremos um link para criar uma nova.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="usuario" className="text-sm font-semibold text-slate-700">E-mail</label>
              <input
                id="usuario" type="email" required autoComplete="email"
                placeholder="voce@email.com"
                className="p-2.5 border-2 rounded outline-none border-sky-200 focus:border-[#5ea2df] transition-colors"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit" disabled={isLoading}
              className="flex justify-center py-3 mt-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
            >
              {isLoading ? <PropagateLoader color="#ffffff" size={12} /> : <span>Enviar link</span>}
            </button>

            <p className="text-sm text-center">
              <Link to="/login" className="text-slate-500 hover:text-slate-700">
                Lembrei a senha, voltar
              </Link>
            </p>
          </form>
        )}
      </div>

      <PainelMarca />
    </div>
  )
}

export default EsqueciASenha
