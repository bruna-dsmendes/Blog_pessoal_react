import { Link } from "react-router-dom";

function Login() {

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen place-items-center font-bold ">
        <form className="flex justify-center items-center flex-col w-1/2 gap-4 ">
          <h2 className="text-slate-900 text-5xl ">Entrar</h2>

          {/* Campo: Usuário */}
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuario"
              className="border-2 border-slate-700 rounded p-2"
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
            />
          </div>

          {/* Botão de Entrar */}
          <button
            type='submit'
            className="rounded bg-indigo-400 flex justify-center hover:bg-indigo-900 text-white w-1/2 py-2"
          >
            <span>Entrar</span>
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

        {/* Div da Imagem de Fundo (visível apenas em telas grandes) */}
        <div
          className="bg-[url('https://ik.imagekit.io/bruumendes/Gemini_Generated_Image_vy21m7vy21m7vy21.png')] lg:block hidden bg-no-repeat w-full min-h-screen bg-cover bg-center"
        ></div>
      </div>
    </>
  );
}

export default Login;