import { api } from './api'
import type Pagina from '../models/Pagina'
import type Postagem from '../models/Postagem'
import type { PostagemRequest, PostagemResumo, StatusPostagem } from '../models/Postagem'

const TAMANHO_PADRAO = 9

export async function feed(pagina = 0, tamanho = TAMANHO_PADRAO): Promise<Pagina<PostagemResumo>> {
  const { data } = await api.get<Pagina<PostagemResumo>>('/postagens', {
    params: { page: pagina, size: tamanho },
  })
  return data
}

export async function porTag(slugTag: string, pagina = 0, tamanho = TAMANHO_PADRAO): Promise<Pagina<PostagemResumo>> {
  const { data } = await api.get<Pagina<PostagemResumo>>(`/postagens/tag/${slugTag}`, {
    params: { page: pagina, size: tamanho },
  })
  return data
}

/** Artigos publicados de um autor. Sem rascunhos, sem sessão. */
export async function porAutor(username: string, pagina = 0, tamanho = TAMANHO_PADRAO): Promise<Pagina<PostagemResumo>> {
  const { data } = await api.get<Pagina<PostagemResumo>>(`/postagens/autor/${username}`, {
    params: { page: pagina, size: tamanho },
  })
  return data
}

export async function buscar(termo: string, pagina = 0, tamanho = TAMANHO_PADRAO): Promise<Pagina<PostagemResumo>> {
  const { data } = await api.get<Pagina<PostagemResumo>>('/postagens/buscar', {
    params: { termo, page: pagina, size: tamanho },
  })
  return data
}

/** Inclui rascunhos. Exige sessão. */
export async function minhas(status?: StatusPostagem, pagina = 0, tamanho = 20): Promise<Pagina<PostagemResumo>> {
  const { data } = await api.get<Pagina<PostagemResumo>>('/postagens/minhas', {
    params: { status, page: pagina, size: tamanho },
  })
  return data
}

export async function porSlug(slug: string): Promise<Postagem> {
  const { data } = await api.get<Postagem>(`/postagens/slug/${slug}`)
  return data
}

export async function porId(id: number | string): Promise<Postagem> {
  const { data } = await api.get<Postagem>(`/postagens/${id}`)
  return data
}

/** Nasce como rascunho. Publicar é um passo separado. */
export async function criar(dados: PostagemRequest): Promise<Postagem> {
  const { data } = await api.post<Postagem>('/postagens', dados)
  return data
}

export async function atualizar(id: number | string, dados: PostagemRequest): Promise<Postagem> {
  const { data } = await api.put<Postagem>(`/postagens/${id}`, dados)
  return data
}

export async function excluir(id: number | string): Promise<void> {
  await api.delete(`/postagens/${id}`)
}

export async function publicar(id: number | string): Promise<Postagem> {
  const { data } = await api.patch<Postagem>(`/postagens/${id}/publicar`)
  return data
}

export async function arquivar(id: number | string): Promise<Postagem> {
  const { data } = await api.patch<Postagem>(`/postagens/${id}/arquivar`)
  return data
}

export async function voltarParaRascunho(id: number | string): Promise<Postagem> {
  const { data } = await api.patch<Postagem>(`/postagens/${id}/rascunho`)
  return data
}
