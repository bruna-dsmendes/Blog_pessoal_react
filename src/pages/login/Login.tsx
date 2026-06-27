import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import type UsuarioLogin from "../../models/UsuarioLogin";
import { ClipLoader } from "react-spinners";


function Login() {

  const navigate = useNavigate();

  const { usuario, handleLogin, isLoading } = useContext(AuthContext)

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(
    {} as UsuarioLogin
  )

  useEffect(() => {
    if (usuario.token !== "") {
      navigate('/home')
    }
  }, [usuario])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    })
  }

  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleLogin(usuarioLogin)
  }
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[calc(100vh-180px)] place-items-center font-bold px-4 py-8 lg:py-0">
        <form className="flex justify-center items-center flex-col w-full lg:w-1/2 gap-4"
          onSubmit={login} >
          <h2 className="text-slate-900 text-5xl">Entrar</h2>

          {/* Campo: Usuário */}
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuario"
              className="border-2 border-slate-700 rounded p-2"
              value={usuarioLogin.usuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>

          {/* Campo: Senha */}
          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={usuarioLogin.senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>

          {/* Botão de Entrar */}
          <button
            type='submit'
            className="rounded bg-pink-300 flex justify-center hover:bg-indigo-900 text-white w-1/2 py-2">

            {isLoading ?
              <ClipLoader color="#ffffff" size={24}
              /> :
              <span>Entrar</span>
            }
          </button>

          <hr className="border-slate-800 w-full" />

          {/* Link para Cadastro */}
          <p>
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="text-indigo-800 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>

        <div
          className="hidden lg:block w-full h-full bg-[url('https://ik.imagekit.io/bruumendes/Gemini_Generated_Image_vy21m7vy21m7vy21.png')] bg-no-repeat bg-cover bg-center"
        ></div>
      </div >
    </>
  );
}

export default Login;