import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type UsuarioLogin from "../../../models/UsuarioLogin";
import { atualizar } from "../../../services/Service";
import { PropagateLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

const inputClass = "w-full border border-hairline rounded-md px-3.5 py-2.5 text-ink bg-paper placeholder:text-ink-faint outline-none focus:border-accent transition-colors"

function FormPerfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UsuarioLogin>({
    id: 0,
    nome: "",
    usuario: "",
    senha: "",
    foto: "",
    token: ""
  });

  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { usuario: usuarioContext, handleLogout, handleAtualizarUsuario } = useContext(AuthContext);
  const token = usuarioContext.token;

  useEffect(() => {
    if (token === '') {
      navigate('/');
    } else {
      setUsuario({
        id: usuarioContext.id,
        nome: usuarioContext.nome,
        usuario: usuarioContext.usuario,
        senha: "",
        foto: usuarioContext.foto,
        token: usuarioContext.token
      });
    }
  }, [token]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value);
  }

  function retornar() {
    navigate("/perfil");
  }

  async function atualizarPerfil(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (usuario.senha.length > 0) {
      if (confirmarSenha === usuario.senha && usuario.senha.length >= 8) {
        try {
          const usuarioComToken = { ...usuario, token };
          await atualizar(`/usuarios/atualizar`, usuario, setUsuario, {
            headers: { 'Authorization': token }
          });
          handleAtualizarUsuario(usuarioComToken);
          ToastAlerta('Perfil atualizado com sucesso!', 'sucesso');
          setTimeout(() => { retornar(); }, 500);
        } catch (error: any) {
          if (error.toString().includes('401')) {
            handleLogout();
          } else {
            ToastAlerta('Erro ao atualizar o perfil.', 'erro');
          }
          setIsLoading(false);
        }
      } else {
        ToastAlerta('As senhas não conferem ou possuem menos de 8 caracteres!', 'erro');
        setUsuario({ ...usuario, senha: '' });
        setConfirmarSenha('');
        setIsLoading(false);
      }
    } else {
      try {
        const usuarioAtualizado = {
          ...usuario,
          senha: usuarioContext.senha,
          token: token
        };
        await atualizar(`/usuarios/atualizar`, usuarioAtualizado, setUsuario, {
          headers: { 'Authorization': token }
        });
        handleAtualizarUsuario(usuarioAtualizado);
        ToastAlerta('Perfil atualizado com sucesso!', 'sucesso');
        setTimeout(() => { retornar(); }, 500);
      } catch (error: any) {
        if (error.toString().includes('401')) {
          handleLogout();
        } else {
          ToastAlerta('Erro ao atualizar o perfil.', 'erro');
        }
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="flex justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-sm">

        <h1 className="font-serif text-3xl font-semibold text-ink text-center mb-8">
          Editar perfil
        </h1>

        <form className="flex flex-col gap-4" onSubmit={atualizarPerfil}>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-sm font-medium text-ink-soft">Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              name='nome'
              className={inputClass}
              value={usuario.nome}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="usuario" className="text-sm font-medium text-ink-soft">E-mail</label>
            <input
              type="text"
              placeholder="Seu e-mail"
              name='usuario'
              className={inputClass}
              value={usuario.usuario}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="foto" className="text-sm font-medium text-ink-soft">URL da foto</label>
            <input
              type="text"
              placeholder="https://..."
              name='foto'
              className={inputClass}
              value={usuario.foto}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="text-sm font-medium text-ink-soft">Nova senha (opcional)</label>
            <input
              type="password"
              placeholder="Deixe em branco para manter a atual"
              name='senha'
              className={inputClass}
              value={usuario.senha}
              onChange={atualizarEstado}
            />
          </div>

          {usuario.senha.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmarSenha" className="text-sm font-medium text-ink-soft">Confirmar nova senha</label>
              <input
                type="password"
                placeholder="Confirme a nova senha"
                name='confirmarSenha'
                className={inputClass}
                value={confirmarSenha}
                onChange={handleConfirmarSenha}
              />
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              className="rounded-full text-ink-soft bg-paper border border-hairline hover:bg-paper-tint w-1/2 py-2.5 transition-colors"
              type="button"
              onClick={retornar}>
              Cancelar
            </button>

            <button
              className="rounded-full text-white bg-accent hover:bg-accent-dark w-1/2 py-2.5 flex justify-center font-medium transition-colors"
              type="submit">
              {isLoading ? <PropagateLoader color="#ffffff" size={8} /> : <span>Salvar</span>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FormPerfil;
