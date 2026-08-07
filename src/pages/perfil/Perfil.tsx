import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiseLoader } from 'react-spinners'
import ListaPostagens from '../../components/postagem/listapostagens/ListaPostagens'
import PerfilCabecalho from '../../components/perfil/cabecalho/PerfilCabecalho'
import { AuthContext } from '../../contexts/AuthContext'
import type { PerfilPublico } from '../../models/Usuario'
import { perfilPublico } from '../../services/usuarioService'

/**
 * Mesmo cabeçalho da página pública, com as ações do dono por cima.
 *
 * Ver a própria página do jeito que os outros veem é mais útil do que uma
 * tela de dados cadastrais, e evita manter dois layouts que se parecem.
 */
function Perfil() {

  // A RotaProtegida já garante que existe sessão antes de chegar aqui.
  const { usuario } = useContext(AuthContext)

  const [perfil, setPerfil] = useState<PerfilPublico | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!usuario) return

    perfilPublico(usuario.username)
      .then(setPerfil)
      .catch(() => setPerfil(null))
      .finally(() => setIsLoading(false))
  }, [usuario])

  if (isLoading) {
    return (
      <div className="flex justify-center w-full my-24">
        <RiseLoader color="#5ea2df" size={24} />
      </div>
    )
  }

  if (!perfil) return null

  const botao = 'px-5 py-2 text-sm font-bold rounded transition-colors'

  return (
    <>
      <PerfilCabecalho
        perfil={perfil}
        acoes={
          <>
            <Link to="/perfil/editar" className={`${botao} text-sky-800 bg-sky-100 hover:bg-sky-200`}>
              Editar perfil
            </Link>
            <Link to="/minhas-postagens" className={`${botao} text-slate-600 bg-slate-100 hover:bg-slate-200`}>
              Meus rascunhos
            </Link>
          </>
        }
      />

      <div className="container px-8 mx-auto mt-10">
        {!perfil.bio && (
          <div className="px-5 py-4 mb-8 border rounded-xl border-amber-200 bg-amber-50">
            <p className="text-sm text-amber-900">
              Sua bio está vazia. É a parte que conta quem você é para quem chega aqui pelo
              seu artigo.{' '}
              <Link to="/perfil/editar" className="font-bold underline">Escrever agora</Link>
            </p>
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-800">
          {perfil.artigosPublicados === 0 ? 'Nada publicado ainda' : 'Artigos publicados'}
        </h2>
      </div>

      <ListaPostagens username={perfil.username} />
    </>
  )
}

export default Perfil
