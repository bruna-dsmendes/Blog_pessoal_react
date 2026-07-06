import { useState, useContext, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type UsuarioLogin from "../../../models/UsuarioLogin";
import { atualizar } from "../../../services/Service";
import { PropagateLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormPerfil() {
  const navigate = useNavigate();

  // Correção da inicialização aqui:
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
          ToastAlerta('Perfil updated com sucesso!', 'sucesso');
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
    <div className="container flex flex-col items-center justify-center mx-auto min-h-[80vh]">
      <h1 className="text-4xl text-center my-8 font-bold text-slate-800">Editar Perfil</h1>

      <form className="w-full max-w-md flex flex-col gap-4 bg-pink-50/50 p-6 rounded-2xl border border-pink-100 shadow-sm"
        onSubmit={atualizarPerfil} >

        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className="text-sm font-semibold text-slate-600">Nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            name='nome'
            className="border border-pink-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-slate-700"
            value={usuario.nome}
            onChange={atualizarEstado}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="usuario" className="text-sm font-semibold text-slate-600">Email / Usuário</label>
          <input
            type="text"
            placeholder="Seu email"
            name='usuario'
            className="border border-pink-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-slate-700"
            value={usuario.usuario}
            onChange={atualizarEstado}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="foto" className="text-sm font-semibold text-slate-600">URL da Foto</label>
          <input
            type="text"
            placeholder="URL da sua foto"
            name='foto'
            className="border border-pink-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-slate-700"
            value={usuario.foto}
            onChange={atualizarEstado}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="senha" className="text-sm font-semibold text-slate-600">Nova Senha (opcional)</label>
          <input
            type="password"
            placeholder="Deixe em branco para manter a atual"
            name='senha'
            className="border border-pink-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-slate-700"
            value={usuario.senha}
            onChange={atualizarEstado}
          />
        </div>

        {usuario.senha.length > 0 && (
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmarSenha" className="text-sm font-semibold text-slate-600">Confirmar Nova Senha</label>
            <input
              type="password"
              placeholder="Confirme a nova senha"
              name='confirmarSenha'
              className="border border-pink-200 rounded-xl p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-slate-700"
              value={confirmarSenha}
              onChange={handleConfirmarSenha}
            />
          </div>
        )}

        <div className="flex gap-4 justify-center mt-4">
          <button
            className="rounded-xl text-slate-700 bg-slate-200 
                        hover:bg-slate-300 w-1/2 py-2.5 flex justify-center font-medium transition cursor-pointer"
            type="button"
            onClick={retornar}>
            Cancelar
          </button>

          <button
            className="rounded-xl text-white bg-pink-400 
                        hover:bg-pink-500 w-1/2 py-2.5 flex justify-center font-medium transition shadow-sm cursor-pointer"
            type="submit">
            {isLoading ? (
              <PropagateLoader color="#ffffff" size={10} className="py-1" />
            ) : (
              <span>Atualizar</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default FormPerfil;