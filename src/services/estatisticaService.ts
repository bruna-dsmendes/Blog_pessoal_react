import { api } from './api'

export interface Estatisticas {
  artigosPublicados: number
  autores: number
  tags: number
  minutosDeConteudo: number
}

export async function daPlataforma(): Promise<Estatisticas> {
  const { data } = await api.get<Estatisticas>('/estatisticas')
  return data
}
