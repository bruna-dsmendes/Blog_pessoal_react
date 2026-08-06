import axios, { AxiosError } from 'axios'

/*
 * baseURL relativa é o que faz o cookie funcionar.
 *
 * As requisições saem para o mesmo domínio da página (/api/...), e o rewrite
 * da Vercel em produção, ou o proxy do Vite em desenvolvimento, encaminha para
 * o Render. Se o front chamasse a URL do Render direto, o cookie seria de
 * terceiro e o Safari o descartaria.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',

  // Sem isso o navegador não envia nem recebe o cookie de sessão.
  withCredentials: true,
})

type Ouvinte = () => void

let aoPerderSessao: Ouvinte | null = null

/** O AuthContext se registra aqui. Evita import circular entre os dois. */
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

/** Extrai a mensagem que a API mandou, com um texto de reserva. */
export function mensagemDeErro(erro: unknown, reserva = 'Não foi possível concluir a operação'): string {
  if (erro instanceof AxiosError) {
    const dados = erro.response?.data as ErroResposta | undefined

    const primeiroCampo = dados?.campos ? Object.values(dados.campos)[0] : undefined

    return primeiroCampo ?? dados?.mensagem ?? reserva
  }

  return reserva
}
