import { api } from './api'
import type Usuario from '../models/Usuario'
import type { LoginRequest, LoginResponse, UsuarioAtualizarRequest, UsuarioRequest } from '../models/Usuario'

export async function cadastrar(dados: UsuarioRequest): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/usuarios/cadastrar', dados)
  return data
}

/** O cookie de sessão vem no cabeçalho Set-Cookie desta resposta. */
export async function logar(dados: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/usuarios/logar', dados)
  return data
}

/*
 * Precisa passar pelo servidor: o cookie é httpOnly, então o JavaScript não
 * consegue apagá-lo. Só quem o escreveu pode sobrescrevê-lo com validade zero.
 */
export async function deslogar(): Promise<void> {
  await api.post('/usuarios/deslogar')
}

/** Fonte da verdade sobre estar logado. Responde 401 quando não há sessão. */
export async function meuPerfil(): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/usuarios/me')
  return data
}

export async function atualizarPerfil(dados: UsuarioAtualizarRequest): Promise<Usuario> {
  const { data } = await api.put<Usuario>('/usuarios/atualizar', dados)
  return data
}
