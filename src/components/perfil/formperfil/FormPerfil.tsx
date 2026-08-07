import { useContext, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import { AuthContext } from '../../../contexts/AuthContext'
import type { Link, TipoLink, UsuarioAtualizarRequest } from '../../../models/Usuario'
import { ROTULO_DO_LINK, TIPOS_DE_LINK } from '../../../models/tiposDeLink'
import { atualizarPerfil } from '../../../services/usuarioService'
import { mensagemDeErro } from '../../../services/api'
import { ToastAlerta } from '../../../utils/ToastAlerta'

const LIMITE_DA_BIO = 280

function FormPerfil() {

  const navigate = useNavigate()
  const { usuario, handleAtualizarUsuario } = useContext(AuthContext)

  const [nome, setNome] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [foto, setFoto] = useState('')
  const [bio, setBio] = useState('')
  const [links, setLinks] = useState<Link[]>([])
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!usuario) return

    setNome(usuario.nome)
    setUsername(usuario.username)
    setEmail(usuario.usuario)
    setFoto(usuario.foto ?? '')
    setBio(usuario.bio ?? '')
    setLinks(usuario.links)
  }, [usuario])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (senha !== '' && senha !== confirmarSenha) {
      ToastAlerta('As senhas não conferem', 'erro')
      return
    }

    setIsLoading(true)

    /*
     * A senha só vai no corpo quando a pessoa quer trocá-la.
     * Mandar o valor antigo de volta faria o backend gerar hash do hash.
     */
    const dados: UsuarioAtualizarRequest = {
      nome,
      username,
      usuario: email,
      foto: foto.trim() || null,
      bio: bio.trim() || null,
      links: links.filter((link) => link.url.trim() !== ''),
      ...(senha !== '' ? { senha } : {}),
    }

    try {
      handleAtualizarUsuario(await atualizarPerfil(dados))
      ToastAlerta('Perfil atualizado', 'sucesso')
      navigate('/perfil')
    } catch (erro) {
      ToastAlerta(mensagemDeErro(erro, 'Erro ao atualizar o perfil'), 'erro')
    } finally {
      setIsLoading(false)
    }
  }

  // Cada rede aparece uma vez só, então o select some quando todas foram usadas.
  const tipoDisponivel = TIPOS_DE_LINK.find((tipo) => !links.some((link) => link.tipo === tipo))

  function trocarTipo(indice: number, tipo: TipoLink) {
    setLinks(links.map((link, i) => (i === indice ? { ...link, tipo } : link)))
  }

  function trocarUrl(indice: number, url: string) {
    setLinks(links.map((link, i) => (i === indice ? { ...link, url } : link)))
  }

  const campo = 'border-2 border-sky-200 rounded p-2 outline-none focus:border-sky-400 transition-colors'
  const rotulo = 'text-sm font-semibold text-slate-700'

  return (
    <div className="max-w-xl px-6 mx-auto my-10">
      <h1 className="mb-8 text-3xl font-black text-slate-800">Editar perfil</h1>

      <form className="flex flex-col gap-5" onSubmit={salvar}>

        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className={rotulo}>Nome</label>
          <input id="nome" className={campo} required minLength={2}
            value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className={rotulo}>Nome de usuário</label>
          <input
            id="username" className={campo} required minLength={3} maxLength={30}
            pattern="[a-z0-9\-]+"
            title="Use apenas letras minúsculas, números e hífen"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          />
          <span className="text-xs text-slate-400">
            Seu perfil fica em /autor/{username || 'seu-nome'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className={rotulo}>Bio</label>
          <textarea
            id="bio" className={`${campo} min-h-24 resize-none`} maxLength={LIMITE_DA_BIO}
            placeholder="Em transição para desenvolvimento, escrevendo sobre Java e o que aprendo pelo caminho."
            value={bio} onChange={(e) => setBio(e.target.value)}
          />
          <span className={`text-xs self-end ${bio.length > LIMITE_DA_BIO - 20 ? 'text-amber-600' : 'text-slate-400'}`}>
            {bio.length} / {LIMITE_DA_BIO}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="foto" className={rotulo}>URL da foto</label>
          <input id="foto" className={campo}
            value={foto} onChange={(e) => setFoto(e.target.value)} />
        </div>

        <fieldset className="flex flex-col gap-3 p-4 border rounded border-sky-100">
          <legend className="px-2 text-sm font-semibold text-slate-500">
            Links do perfil
          </legend>

          {links.length === 0 && (
            <p className="text-sm text-slate-400">Nenhum link adicionado ainda.</p>
          )}

          {links.map((link, indice) => (
            <div key={link.tipo} className="flex gap-2">
              <select
                className={`${campo} w-36`}
                value={link.tipo}
                onChange={(e) => trocarTipo(indice, e.target.value as TipoLink)}
              >
                {TIPOS_DE_LINK
                  .filter((tipo) => tipo === link.tipo || !links.some((atual) => atual.tipo === tipo))
                  .map((tipo) => (
                    <option key={tipo} value={tipo}>{ROTULO_DO_LINK[tipo]}</option>
                  ))}
              </select>

              <input
                type="url" className={`${campo} flex-1`} maxLength={300}
                placeholder="https://..."
                value={link.url}
                onChange={(e) => trocarUrl(indice, e.target.value)}
              />

              <button
                type="button"
                aria-label={`Remover ${ROTULO_DO_LINK[link.tipo]}`}
                onClick={() => setLinks(links.filter((_, i) => i !== indice))}
                className="px-3 font-bold rounded text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                ×
              </button>
            </div>
          ))}

          {tipoDisponivel && (
            <button
              type="button"
              onClick={() => setLinks([...links, { tipo: tipoDisponivel, url: '' }])}
              className="self-start px-4 py-2 text-sm font-semibold rounded text-sky-800 bg-sky-100 hover:bg-sky-200"
            >
              Adicionar link
            </button>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-4 p-4 border rounded border-sky-100">
          <legend className="px-2 text-sm font-semibold text-slate-500">
            Trocar senha (deixe em branco para manter)
          </legend>

          <input type="password" className={campo} minLength={8} placeholder="Nova senha"
            value={senha} onChange={(e) => setSenha(e.target.value)} />

          <input type="password" className={campo} placeholder="Confirmar nova senha"
            value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
        </fieldset>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/perfil')}
            className="px-6 py-2 font-semibold rounded text-slate-600 bg-slate-100 hover:bg-slate-200">
            Cancelar
          </button>

          <button type="submit" disabled={isLoading}
            className="flex justify-center flex-1 px-6 py-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-50">
            {isLoading ? <PropagateLoader color="#ffffff" size={12} /> : <span>Salvar</span>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormPerfil
