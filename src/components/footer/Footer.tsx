import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import LinkLegal from '../legal/LinkLegal'

const REPOSITORIO = 'https://github.com/bruna-dsmendes/blog-pessoal'
const DOCUMENTACAO = 'https://blogpessoal-qkji.onrender.com/swagger-ui/index.html'

function Titulo({ children }: { children: string }) {
  return (
    <h3 className="mb-3 font-mono text-xs font-bold tracking-wider uppercase text-slate-400">
      {children}
    </h3>
  )
}

function Footer() {

  const { estaAutenticado } = useContext(AuthContext)
  const ano = new Date().getFullYear()

  const item = 'text-sm text-slate-600 hover:text-sky-600 transition-colors'

  return (
    <footer className="mt-16 border-t bg-sky-50 border-sky-100">
      <div className="container grid grid-cols-1 gap-10 px-8 py-12 mx-auto md:grid-cols-3">

        <div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" className="w-7 h-7 text-[#5ea2df] stroke-[2.5]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span className="text-lg font-black tracking-tight text-slate-800">
              Simetria<span className="text-[#5ea2df]">.Dev</span>
            </span>
          </div>

          <p className="max-w-xs mt-3 text-sm leading-relaxed text-slate-500">
            Um espaço para transformar conteúdo extenso em resumo que você entende,
            e que ajuda quem vem depois.
          </p>
        </div>

        <nav>
          <Titulo>Navegar</Titulo>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className={item}>Feed</Link></li>
            <li>
              {estaAutenticado
                ? <Link to="/minhas-postagens" className={item}>Minhas postagens</Link>
                : <Link to="/login" className={item}>Entrar</Link>}
            </li>
            {!estaAutenticado && (
              <li><Link to="/cadastro" className={item}>Criar conta</Link></li>
            )}
          </ul>
        </nav>

        <div>
          <Titulo>Legal</Titulo>
          <ul className="flex flex-col items-start gap-2 mb-8">
            <li>
              <LinkLegal documento="privacidade" className={item}>
                Política de Privacidade
              </LinkLegal>
            </li>
            <li>
              <LinkLegal documento="termos" className={item}>
                Termos de Uso
              </LinkLegal>
            </li>
          </ul>

          <Titulo>Projeto</Titulo>
          <ul className="flex flex-col gap-2">
            <li>
              <a href={REPOSITORIO} target="_blank" rel="noreferrer" className={item}>
                Código no GitHub ↗
              </a>
            </li>
            <li>
              <a href={DOCUMENTACAO} target="_blank" rel="noreferrer" className={item}>
                Documentação da API ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sky-100">
        <div className="container px-8 py-5 mx-auto text-sm text-center text-slate-500">
          {ano} · Feito por{' '}
          <Link to="/autor/bruna-mendes" className="font-semibold text-slate-700 hover:text-sky-600">
            Bruna Mendes
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
