export default interface Usuario {
  id: number
  nome: string
  usuario: string
  foto: string | null
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
  usuario: string
  senha?: string
  foto?: string | null
}

export interface LoginRequest {
  usuario: string
  senha: string
}

/*
 * A sessão vive no cookie httpOnly. O campo token existe na resposta por
 * compatibilidade, mas o front não guarda esse valor em lugar nenhum.
 */
export interface LoginResponse {
  id: number
  nome: string
  usuario: string
  foto: string | null
  tipo: string
  expiraEm: string
}
