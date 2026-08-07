import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../contexts/AuthContext'
import { baixarMeusDados, excluirConta, type DestinoDosArtigos } from '../../../services/usuarioService'
import { mensagemDeErro } from '../../../services/api'
import { ToastAlerta } from '../../../utils/ToastAlerta'

function ZonaDaConta() {

  const navigate = useNavigate()
  const { handleLogout } = useContext(AuthContext)

  const [confirmando, setConfirmando] = useState(false)
  const [senha, setSenha] = useState('')
  const [destino, setDestino] = useState<DestinoDosArtigos>('ANONIMIZAR')
  const [ocupado, setOcupado] = useState(false)

  async function baixar() {
    setOcupado(true)

    try {
      await baixarMeusDados()
      ToastAlerta('Download iniciado', 'sucesso')
    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Não foi possível gerar o arquivo'), 'erro')
    } finally {
      setOcupado(false)
    }
  }

  async function excluir() {
    setOcupado(true)

    try {
      await excluirConta(senha, destino)

      // A sessão já morreu no servidor; aqui só limpamos o estado local.
      await handleLogout()

      ToastAlerta('Sua conta foi excluída', 'info')
      navigate('/')

    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Não foi possível excluir a conta'), 'erro')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="max-w-xl px-6 mx-auto mb-16">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Seus dados</h2>

      <div className="flex flex-col gap-4 p-5 border rounded-xl border-sky-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-700">Baixar meus dados</p>
            <p className="text-sm text-slate-500">
              Um arquivo com seu cadastro, artigos e rascunhos.
            </p>
          </div>

          <button
            type="button" onClick={baixar} disabled={ocupado}
            className="px-4 py-2 text-sm font-semibold rounded text-sky-800 bg-sky-100 hover:bg-sky-200 disabled:opacity-50"
          >
            Baixar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 mt-6 border rounded-xl border-red-200 bg-red-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-red-900">Excluir minha conta</p>
            <p className="text-sm text-red-700">Essa ação não tem volta.</p>
          </div>

          {!confirmando && (
            <button
              type="button" onClick={() => setConfirmando(true)}
              className="px-4 py-2 text-sm font-semibold text-red-700 bg-white border border-red-200 rounded hover:bg-red-100"
            >
              Excluir conta
            </button>
          )}
        </div>

        {confirmando && (
          <div className="flex flex-col gap-4 pt-4 border-t border-red-200">

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold text-red-900">
                O que fazer com seus artigos publicados?
              </legend>

              <label className="flex items-start gap-2 text-sm text-red-900">
                <input
                  type="radio" name="destino" className="mt-1"
                  checked={destino === 'ANONIMIZAR'}
                  onChange={() => setDestino('ANONIMIZAR')}
                />
                <span>
                  <strong>Manter sem meu nome.</strong> Os artigos continuam no ar,
                  sem vínculo com você, e os links que já circularam seguem funcionando.
                </span>
              </label>

              <label className="flex items-start gap-2 text-sm text-red-900">
                <input
                  type="radio" name="destino" className="mt-1"
                  checked={destino === 'EXCLUIR'}
                  onChange={() => setDestino('EXCLUIR')}
                />
                <span>
                  <strong>Apagar tudo.</strong> Artigos, rascunhos e reações somem
                  junto com a conta.
                </span>
              </label>
            </fieldset>

            <label className="flex flex-col gap-1 text-sm font-semibold text-red-900">
              Confirme sua senha
              <input
                type="password" autoComplete="current-password"
                className="p-2 bg-white border-2 border-red-200 rounded outline-none focus:border-red-400"
                value={senha} onChange={(e) => setSenha(e.target.value)}
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setConfirmando(false); setSenha('') }}
                className="px-4 py-2 text-sm font-semibold rounded text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button" onClick={excluir} disabled={ocupado || senha === ''}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Excluir definitivamente
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ZonaDaConta
