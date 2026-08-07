import { api } from './api'
import type Usuario from '../models/Usuario'
import type { LoginRequest, LoginResponse, PerfilPublico, UsuarioAtualizarRequest, UsuarioRequest } from '../models/Usuario'

export async function cadastrar(dados: UsuarioRequest): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/usuarios/cadastrar', dados)
  return data
}

export async function logar(dados: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/usuarios/logar', dados)
  return data
}

/** Precisa passar pelo servidor: o JavaScript não apaga cookie httpOnly. */
export async function deslogar(): Promise<void> {
  await api.post('/usuarios/deslogar')
}

/** Fonte da verdade sobre a sessão. Responde 401 quando não há uma. */
export async function meuPerfil(): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/usuarios/me')
  return data
}

export async function atualizarPerfil(dados: UsuarioAtualizarRequest): Promise<Usuario> {
  const { data } = await api.put<Usuario>('/usuarios/atualizar', dados)
  return data
}

export async function perfilPublico(username: string): Promise<PerfilPublico> {
  const { data } = await api.get<PerfilPublico>(`/usuarios/perfil/${username}`)
  return data
}

/** Portabilidade: baixa um JSON com cadastro, artigos e reações. */
export async function baixarMeusDados(): Promise<void> {
  const { data } = await api.get('/usuarios/me/dados')

  const arquivo = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const endereco = URL.createObjectURL(arquivo)

  const link = document.createElement('a')
  link.href = endereco
  link.download = `meus-dados-${new Date().toISOString().slice(0, 10)}.json`
  link.click()

  URL.revokeObjectURL(endereco)
}

export type DestinoDosArtigos = 'ANONIMIZAR' | 'EXCLUIR'

export async function excluirConta(senha: string, destinoDosArtigos: DestinoDosArtigos): Promise<void> {
  await api.post('/usuarios/excluir-conta', { senha, destinoDosArtigos })
}
