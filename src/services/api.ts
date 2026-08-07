import axios, { AxiosError } from 'axios'

/*
 * A baseURL é relativa de propósito: chamar a URL do backend direto faria o
 * cookie de sessão virar cookie de terceiro, que o Safari descarta. O rewrite
 * da Vercel e o proxy do Vite encaminham /api para o backend.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',

  // Sem isso o navegador não envia nem recebe o cookie de sessão.
  withCredentials: true,
})

type Ouvinte = () => void

let aoPerderSessao: Ouvinte | null = null

/** O AuthContext se registra aqui, o que evita import circular. */
export function registrarPerdaDeSessao(ouvinte: Ouvinte) {
  aoPerderSessao = ouvinte
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro: AxiosError) => {
    const status = erro.response?.status
    const url = erro.config?.url ?? ''

    /*
     * 401 em /logar significa senha errada, e em /me significa que ninguém
     * está logado. Nenhum dos dois é sessão expirada, então não dispara logout.
     */
    const rotaDeAutenticacao = url.includes('/usuarios/logar') || url.includes('/usuarios/me')

    if (status === 401 && !rotaDeAutenticacao) {
      aoPerderSessao?.()
    }

    return Promise.reject(erro)
  },
)

interface ErroResposta {
  mensagem?: string
  campos?: Record<string, string>
}

export function mensagemDeErro(erro: unknown, reserva = 'Não foi possível concluir a operação'): string {
  if (erro instanceof AxiosError) {
    const dados = erro.response?.data as ErroResposta | undefined

    const primeiroCampo = dados?.campos ? Object.values(dados.campos)[0] : undefined

    return primeiroCampo ?? dados?.mensagem ?? reserva
  }

  return reserva
}
