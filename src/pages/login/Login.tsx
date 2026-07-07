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

const inputClass = (hasError: boolean) =>
  `w-full border rounded-md px-3.5 py-2.5 text-ink bg-paper placeholder:text-ink-faint
   outline-none transition-colors
   ${hasError ? 'border-red-400 focus:border-red-400' : 'border-hairline focus:border-accent'}`

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
    <div className="flex justify-center px-4 py-16 md:py-24">
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2 justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6 text-accent stroke-[2.5]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <span className="font-serif text-xl font-semibold tracking-tight text-ink">
            Simetria<span className="text-accent">.Dev</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-ink text-center mb-8">
          Bem-vindo de volta
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="usuario" className="text-sm font-medium text-ink-soft">E-mail</label>
            <input
              type="text"
              id="usuario"
              placeholder="voce@email.com"
              {...register("usuario")}
              className={inputClass(!!errors.usuario)}
            />
            {errors.usuario && (
              <span className="text-xs text-red-500">{errors.usuario.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="text-sm font-medium text-ink-soft">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              {...register("senha")}
              className={inputClass(!!errors.senha)}
            />
            {errors.senha && (
              <span className="text-xs text-red-500">{errors.senha.message}</span>
            )}
          </div>

          <button
            type='submit'
            className="rounded-full bg-accent hover:bg-accent-dark text-white font-medium py-2.5 mt-2 flex justify-center transition-colors">
            {isLoading ? <RiseLoader color="#ffffff" size={8} /> : <span>Entrar</span>}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-8">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="text-accent-dark font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
