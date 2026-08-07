import type Tag from './Tag'

export type StatusPostagem = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO'

export interface Autor {
  id: number
  nome: string
  /** Usado para montar o link do perfil público, sem requisição extra. */
  username: string
  foto: string | null
}

/** Resposta completa, usada na leitura de um artigo. */
export default interface Postagem {
  id: number
  titulo: string
  subtitulo: string | null
  conteudo: string
  slug: string
  capaUrl: string | null
  status: StatusPostagem
  tempoLeitura: number
  criadoEm: string
  atualizadoEm: string | null
  publicadoEm: string | null
  autor: Autor | null
  tags: Tag[]
}

/** Resposta do feed. Não traz o markdown. */
export interface PostagemResumo {
  id: number
  titulo: string
  subtitulo: string | null
  slug: string
  capaUrl: string | null
  status: StatusPostagem
  tempoLeitura: number
  publicadoEm: string | null
  atualizadoEm: string | null
  autor: Autor | null
  tags: Tag[]
}

export interface PostagemRequest {
  titulo: string
  subtitulo?: string | null
  conteudo: string
  capaUrl?: string | null
  tags: string[]
}
