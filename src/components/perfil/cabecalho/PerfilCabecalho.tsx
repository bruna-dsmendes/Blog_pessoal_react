import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { PerfilPublico } from '../../../models/Usuario'

interface PerfilCabecalhoProps {
  perfil: PerfilPublico
  /** Botões de editar e rascunhos, só na visão do dono. */
  acoes?: ReactNode
}

function iniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')
}

function Estatistica({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div className="text-center">
      <span className="block text-2xl font-black tracking-tight text-slate-800">{valor}</span>
      <span className="text-xs font-bold tracking-wider uppercase text-slate-400">{rotulo}</span>
    </div>
  )
}

function PerfilCabecalho({ perfil, acoes }: PerfilCabecalhoProps) {

  /*
   * Minutos vira "12h 30min" a partir de uma hora. Um número solto de três
   * dígitos em minutos não diz nada para quem lê.
   */
  const horas = Math.floor(perfil.minutosEscritos / 60)
  const restante = perfil.minutosEscritos % 60
  const tempo = horas > 0 ? `${horas}h ${restante}min` : `${perfil.minutosEscritos}min`

  return (
    <header className="border-b bg-gradient-to-b from-sky-50 to-white border-sky-100">
      <div className="container flex flex-col gap-6 px-8 py-12 mx-auto md:flex-row md:items-start">

        {perfil.foto ? (
          <img
            src={perfil.foto}
            alt={perfil.nome}
            className="object-cover border-4 border-white rounded-full shadow-md w-28 h-28"
          />
        ) : (
          <div className="flex items-center justify-center text-3xl font-black text-white border-4 border-white rounded-full shadow-md w-28 h-28 bg-sky-400">
            {iniciais(perfil.nome)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-black tracking-tight text-slate-800">{perfil.nome}</h1>
          <p className="font-mono text-sm text-sky-600">@{perfil.username}</p>

          {perfil.bio && (
            <p className="max-w-xl mt-4 leading-relaxed text-slate-600">{perfil.bio}</p>
          )}

          {(perfil.linkGithub || perfil.linkLinkedin) && (
            <div className="flex flex-wrap gap-4 mt-4 text-sm font-semibold">
              {perfil.linkGithub && (
                <a href={perfil.linkGithub} target="_blank" rel="noreferrer"
                  className="text-slate-600 hover:text-sky-600">
                  GitHub ↗
                </a>
              )}
              {perfil.linkLinkedin && (
                <a href={perfil.linkLinkedin} target="_blank" rel="noreferrer"
                  className="text-slate-600 hover:text-sky-600">
                  LinkedIn ↗
                </a>
              )}
            </div>
          )}

          {perfil.tagsMaisUsadas.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                Escreve sobre
              </span>
              {perfil.tagsMaisUsadas.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-white border border-sky-100 text-sky-700 hover:bg-sky-50"
                >
                  {tag.nome}
                </Link>
              ))}
            </div>
          )}

          {acoes && <div className="flex flex-wrap gap-3 mt-6">{acoes}</div>}
        </div>

        <div className="flex gap-8 px-6 py-4 bg-white border shadow-sm rounded-2xl border-sky-100 md:self-center">
          <Estatistica valor={String(perfil.artigosPublicados)} rotulo="artigos" />
          <Estatistica valor={tempo} rotulo="de leitura" />
        </div>
      </div>
    </header>
  )
}

export default PerfilCabecalho
