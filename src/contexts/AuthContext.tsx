import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type Usuario from '../models/Usuario'
import type { LoginRequest } from '../models/Usuario'
import { registrarPerdaDeSessao, mensagemDeErro } from '../services/api'
import { deslogar, logar, meuPerfil } from '../services/usuarioService'
import { ToastAlerta } from '../utils/ToastAlerta'

interface AuthContextProps {
  usuario: Usuario | null
  estaAutenticado: boolean
  /** true enquanto a checagem inicial de sessão não terminou. */
  carregandoSessao: boolean
  isLoading: boolean
  handleLogin(dados: LoginRequest): Promise<boolean>
  handleLogout(): Promise<void>
  handleAtualizarUsuario(usuario: Usuario): void
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: { children: ReactNode }) {

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregandoSessao, setCarregandoSessao] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  /*
   * Com o token em localStorage, o front sabia se estava logado olhando o
   * próprio estado. Aqui ele não enxerga o cookie, então quem responde essa
   * pergunta é o servidor: se /usuarios/me devolve 200, existe sessão.
   *
   * O efeito colateral é bom: recarregar a página deixa de deslogar.
   */
  useEffect(() => {
    let ativo = true

    meuPerfil()
      .then((perfil) => { if (ativo) setUsuario(perfil) })
      .catch(() => { if (ativo) setUsuario(null) })
      .finally(() => { if (ativo) setCarregandoSessao(false) })

    return () => { ativo = false }
  }, [])

  const encerrarSessaoLocal = useCallback(() => {
    setUsuario(null)
  }, [])

  // O interceptor avisa aqui quando alguma requisição volta 401.
  useEffect(() => {
    registrarPerdaDeSessao(() => {
      encerrarSessaoLocal()
      ToastAlerta('Sua sessão expirou. Entre novamente.', 'info')
    })
  }, [encerrarSessaoLocal])

  async function handleLogin(dados: LoginRequest): Promise<boolean> {
    setIsLoading(true)

    try {
      await logar(dados)

      // O cookie já veio na resposta do login; agora buscamos o perfil por ele.
      setUsuario(await meuPerfil())

      ToastAlerta('Bem-vinda de volta!', 'sucesso')
      return true

    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'E-mail ou senha inválidos'), 'erro')
      return false

    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await deslogar()
    } catch {
      // Mesmo se a chamada falhar, limpamos o estado local.
    } finally {
      encerrarSessaoLocal()
    }
  }

  function handleAtualizarUsuario(atualizado: Usuario) {
    setUsuario(atualizado)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: usuario !== null,
        carregandoSessao,
        isLoading,
        handleLogin,
        handleLogout,
        handleAtualizarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
