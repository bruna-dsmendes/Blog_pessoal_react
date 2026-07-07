import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { RiseLoader } from "react-spinners";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type UsuarioLogin from "../../models/UsuarioLogin";

const schemaLogin = yup.object({
  usuario: yup
    .string()
    .required("O campo usuário é obrigatório")
    .email("Insira um e-mail válido"),
  senha: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve conter no mínimo 8 caracteres"),
}).required();

type FormData = yup.InferType<typeof schemaLogin>;

function Login() {
  const navigate = useNavigate();
  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaLogin),
  });

  useEffect(() => {
    if (usuario.token !== "") {
      navigate('/home');
    }
  }, [usuario, navigate]);

  function onSubmit(data: FormData) {
    handleLogin(data as UsuarioLogin);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[calc(100vh-180px)] place-items-center font-bold px-4 py-8 lg:py-0">

        <form
          className="flex justify-center items-center flex-col w-full lg:w-1/2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-sky-900 text-5xl mb-2">Entrar</h2>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              placeholder="Ex: bruna@email.com"
              {...register("usuario")}
              className={`border-2 rounded p-2 outline-none transition-all
                ${errors.usuario ? 'border-red-500 focus:border-red-500' : 'border-sky-200 focus:border-[#5ea2df]'}`}
            />
            {errors.usuario && (
              <span className="text-xs font-bold text-red-500 font-mono mt-0.5">
                {errors.usuario.message}
              </span>
            )}
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              {...register("senha")}
              className={`border-2 rounded p-2 outline-none transition-all
                ${errors.senha ? 'border-red-500 focus:border-red-500' : 'border-sky-200 focus:border-[#5ea2df]'}`}
            />
            {errors.senha && (
              <span className="text-xs font-bold text-red-500 font-mono mt-0.5">
                {errors.senha.message}
              </span>
            )}
          </div>

          {/* Botão de Entrar */}
          <button
            type='submit'
            className="rounded bg-sky-200 flex justify-center hover:bg-sky-300 text-sky-900 w-1/2 py-2 mt-2 transition-colors">
            {isLoading ? (
              <RiseLoader color="#0c4a6e" size={14} />
            ) : (
              <span>Entrar</span>
            )}
          </button>

          <hr className="border-sky-200 w-full my-2" />

          <p className="font-normal text-slate-600">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="text-sky-700 font-bold hover:underline">
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