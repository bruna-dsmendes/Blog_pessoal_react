export default interface Usuario {
  id: number
  nome: string
  username: string
  usuario: string
  foto: string | null
  bio: string | null
  linkGithub: string | null
  linkLinkedin: string | null
}

/** Página aberta, por isso sem e-mail. */
export interface PerfilPublico {
  username: string
  nome: string
  foto: string | null
  bio: string | null
  linkGithub: string | null
  linkLinkedin: string | null
  artigosPublicados: number
  minutosEscritos: number
  tagsMaisUsadas: { id: number; nome: string; slug: string }[]
}

export interface UsuarioRequest {
  nome: string
  usuario: string
  senha: string
  foto?: string | null
}

/** A senha é opcional: enviar só quando a pessoa quiser trocá-la. */
export interface UsuarioAtualizarRequest {
  nome: string
  username: string
  usuario: string
  senha?: string
  foto?: string | null
  bio?: string | null
  linkGithub?: string | null
  linkLinkedin?: string | null
}

export interface LoginRequest {
  usuario: string
  senha: string
}

/** A sessão vive no cookie. O front não guarda o token em lugar nenhum. */
export interface LoginResponse {
  id: number
  nome: string
  usuario: string
  foto: string | null
  tipo: string
  expiraEm: string
}
