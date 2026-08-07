import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../contexts/AuthContext'
import { desfazerReacao, reagir } from '../../../services/postagemService'
import { mensagemDeErro } from '../../../services/api'
import { ToastAlerta } from '../../../utils/ToastAlerta'

interface BotaoReacaoProps {
  postagemId: number
  totalInicial: number
  reagiInicial: boolean
}

function Coracao({ preenchido }: { preenchido: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill={preenchido ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={2}
      className="w-5 h-5 transition-transform group-active:scale-90"
    >
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.098 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

function BotaoReacao({ postagemId, totalInicial, reagiInicial }: BotaoReacaoProps) {

  const navigate = useNavigate()
  const { estaAutenticado } = useContext(AuthContext)

  const [total, setTotal] = useState(totalInicial)
  const [reagi, setReagi] = useState(reagiInicial)
  const [enviando, setEnviando] = useState(false)

  async function alternar() {

    if (!estaAutenticado) {
      ToastAlerta('Entre para curtir este artigo', 'info')
      navigate('/login')
      return
    }

    // Atualiza a tela antes da resposta chegar e reverte se falhar
    const anterior = { total, reagi }

    setReagi(!reagi)
    setTotal(reagi ? total - 1 : total + 1)
    setEnviando(true)

    try {
      const resposta = reagi
        ? await desfazerReacao(postagemId)
        : await reagir(postagemId)

      setTotal(resposta.total)
      setReagi(resposta.reagi)

    } catch (erro) {
      setTotal(anterior.total)
      setReagi(anterior.reagi)
      ToastAlerta(mensagemDeErro(erro, 'Não foi possível registrar sua curtida'), 'erro')

    } finally {
      setEnviando(false)
    }
  }

  return (
    <button
      onClick={alternar}
      disabled={enviando}
      aria-pressed={reagi}
      aria-label={reagi ? 'Remover curtida' : 'Curtir artigo'}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-colors disabled:opacity-60 ${reagi
          ? 'border-rose-200 bg-rose-50 text-rose-600'
          : 'border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-500'
        }`}
    >
      <Coracao preenchido={reagi} />
      <span className="text-sm font-bold tabular-nums">{total}</span>
    </button>
  )
}

export default BotaoReacao
