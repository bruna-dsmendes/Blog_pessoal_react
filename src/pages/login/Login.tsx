import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { RiseLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PainelMarca from "../../components/marca/PainelMarca";

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
  const { estaAutenticado, handleLogin, isLoading } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaLogin),
  });

  useEffect(() => {
    if (estaAutenticado) {
      navigate('/');
    }
  }, [estaAutenticado, navigate]);

  function onSubmit(data: FormData) {
    handleLogin(data);
  }

  const campo = (temErro: boolean) =>
    `border-2 rounded p-2.5 outline-none transition-colors ${
      temErro ? 'border-red-400 focus:border-red-500' : 'border-sky-200 focus:border-[#5ea2df]'
    }`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-180px)]">

      <div className="flex items-center justify-center px-6 py-16">
        <form className="flex flex-col w-full max-w-sm gap-5" onSubmit={handleSubmit(onSubmit)}>

          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">Entrar</h1>
            <p className="mt-2 text-slate-500">Bom te ver de novo.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="usuario" className="text-sm font-semibold text-slate-700">E-mail</label>
            <input
              type="email"
              id="usuario"
              placeholder="voce@email.com"
              autoComplete="email"
              {...register("usuario")}
              className={campo(!!errors.usuario)}
            />
            {errors.usuario && (
              <span className="text-xs font-semibold text-red-500">{errors.usuario.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="text-sm font-semibold text-slate-700">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Sua senha"
              autoComplete="current-password"
              {...register("senha")}
              className={campo(!!errors.senha)}
            />
            {errors.senha && (
              <span className="text-xs font-semibold text-red-500">{errors.senha.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center py-3 mt-2 font-bold text-white transition-colors rounded bg-sky-500 hover:bg-sky-600 disabled:opacity-60"
          >
            {isLoading ? <RiseLoader color="#ffffff" size={10} /> : <span>Entrar</span>}
          </button>

          <p className="text-sm text-center text-slate-500">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="font-bold text-sky-600 hover:underline">
              Cadastre-se
            </Link>
          </p>

          <p className="text-sm text-center">
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Ou continue lendo sem entrar
            </Link>
          </p>
        </form>
      </div>

      <PainelMarca />
    </div>
  );
}

export default Login;
