import { useContext, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropagateLoader } from 'react-spinners'
import { AuthContext } from '../../../contexts/AuthContext'
import type { UsuarioAtualizarRequest } from '../../../models/Usuario'
import { atualizarPerfil } from '../../../services/usuarioService'
import { mensagemDeErro } from '../../../services/api'
import { ToastAlerta } from '../../../utils/ToastAlerta'

function FormPerfil() {

  const navigate = useNavigate()
  const { usuario, handleAtualizarUsuario } = useContext(AuthContext)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [foto, setFoto] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!usuario) return

    setNome(usuario.nome)
    setEmail(usuario.usuario)
    setFoto(usuario.foto ?? '')
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
      usuario: email,
      foto: foto.trim() || null,
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

  const campo = 'border-2 border-sky-200 rounded p-2 outline-none focus:border-sky-400 transition-colors'
  const rotulo = 'text-sm font-semibold text-slate-700'

  return (
    <div className="max-w-lg px-6 mx-auto my-10">
      <h1 className="mb-8 text-3xl font-black text-slate-800">Editar perfil</h1>

      <form className="flex flex-col gap-5" onSubmit={salvar}>

        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className={rotulo}>Nome</label>
          <input id="nome" className={campo} required minLength={2}
            value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={rotulo}>E-mail</label>
          <input id="email" type="email" className={campo} required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="foto" className={rotulo}>URL da foto</label>
          <input id="foto" className={campo}
            value={foto} onChange={(e) => setFoto(e.target.value)} />
        </div>

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
