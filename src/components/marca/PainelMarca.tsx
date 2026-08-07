/**
 * Painel lateral das telas de entrada.
 *
 * Feito só com CSS, sem imagem externa. Além de não depender de um link que
 * pode cair, carrega instantâneo e não impõe um rosto a quem visita.
 */
function PainelMarca() {
  return (
    <aside className="relative hidden w-full h-full overflow-hidden lg:flex lg:flex-col lg:justify-center bg-slate-900">

      {/* Malha de fundo: apenas duas repetições de gradiente, sem imagem. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Brilho difuso atrás do conteúdo. */}
      <div
        aria-hidden
        className="absolute rounded-full -top-32 -right-24 w-96 h-96 bg-sky-500/20 blur-3xl"
      />

      <div className="relative z-10 max-w-md px-12">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" className="w-10 h-10 text-[#5ea2df] stroke-[2.5]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <span className="text-2xl font-black tracking-tight text-white">
            Simetria<span className="text-[#5ea2df]">.Dev</span>
          </span>
        </div>

        <h2 className="mt-10 text-4xl font-black leading-tight tracking-tight text-white">
          Escrever é a melhor forma de
          <span className="text-[#5ea2df]"> estudar</span>.
        </h2>

        <p className="mt-5 leading-relaxed text-slate-400">
          Um espaço para transformar conteúdo extenso em resumo que você
          entende, e que ajuda quem vem depois.
        </p>

        {/* Amostra do editor. Decorativa, mas mostra o que a plataforma faz. */}
        <div className="p-4 mt-10 border rounded-xl border-white/10 bg-white/5">
          <div className="flex gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>

          <pre className="font-mono text-xs leading-relaxed text-slate-300">
            <span className="text-[#5ea2df]"># </span>Autenticado não é autorizado{'\n\n'}
            O controller conferia se o id{'\n'}
            existia. <span className="text-white">**Só isso.**</span>
          </pre>

          <div className="flex gap-2 mt-4">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#5ea2df]/15 text-[#5ea2df]">Java</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#5ea2df]/15 text-[#5ea2df]">Spring Boot</span>
          </div>
        </div>

        <p className="mt-8 font-mono text-xs tracking-widest uppercase text-slate-500">
          Estudos &amp; Resumos
        </p>
      </div>
    </aside>
  )
}

export default PainelMarca
