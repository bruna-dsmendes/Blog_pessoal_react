import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RiseLoader } from 'react-spinners'
import ListaPostagens from '../../components/postagem/listapostagens/ListaPostagens'
import PerfilCabecalho from '../../components/perfil/cabecalho/PerfilCabecalho'
import type { PerfilPublico } from '../../models/Usuario'
import { perfilPublico } from '../../services/usuarioService'

/** Página aberta de autor. Qualquer pessoa acessa, sem login. */
function Autor() {

  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState<PerfilPublico | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!username) return

    setIsLoading(true)

    perfilPublico(username)
      .then(setPerfil)
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setIsLoading(false))
  }, [username, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center w-full my-24">
        <RiseLoader color="#5ea2df" size={24} />
      </div>
    )
  }

  if (!perfil) return null

  return (
    <>
      <PerfilCabecalho perfil={perfil} />

      <div className="container px-8 mx-auto mt-10">
        <h2 className="text-xl font-bold text-slate-800">
          {perfil.artigosPublicados === 0
            ? 'Ainda não publicou nada'
            : perfil.artigosPublicados === 1
              ? '1 artigo publicado'
              : `${perfil.artigosPublicados} artigos publicados`}
        </h2>
      </div>

      <ListaPostagens username={username} />
    </>
  )
}

export default Autor
