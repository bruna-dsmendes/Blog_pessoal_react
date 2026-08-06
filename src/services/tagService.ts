import { api } from './api'
import type Pagina from '../models/Pagina'
import type Tag from '../models/Tag'

export async function listar(pagina = 0, tamanho = 30): Promise<Pagina<Tag>> {
  const { data } = await api.get<Pagina<Tag>>('/tags', {
    params: { page: pagina, size: tamanho },
  })
  return data
}

/** Usada no autocomplete do editor. */
export async function buscarPorNome(nome: string): Promise<Tag[]> {
  const { data } = await api.get<Pagina<Tag>>('/tags/buscar', {
    params: { nome, page: 0, size: 8 },
  })
  return data.conteudo
}
