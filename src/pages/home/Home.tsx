import ListaPostagens from "../../components/postagem/listapostagens/ListaPostagens";

function Home() {
  return (
    <>

      <div className="bg-sky-100 border-b border-sky-200 pb-16">
        <div className="container grid grid-cols-2 text-sky-900 mx-auto px-8 py-16">

          <div className="flex flex-col gap-5 items-start justify-center pr-4">
            <h2 className="text-7xl font-black tracking-tight text-slate-800 leading-none">
              <span className="bg-gradient-to-r from-slate-800 via-[#5ea2df] to-sky-600 bg-clip-text text-transparent">
                Simetria Dev
              </span>
            </h2>

            <p className="text-xl font-medium text-slate-600 max-w-md mt-2 leading-relaxed">
              O espaço para simplificar conteúdos extensos e organizar nossa jornada tech em grupo. Faça o seu
              <span className="text-[#5ea2df] font-mono font-bold"> &lt;registro de aprendizado/&gt;</span>.
            </p>

            <div className="mt-4 px-4 py-2 rounded-full bg-white/60 border border-sky-300 text-xs font-mono font-bold uppercase tracking-wider text-sky-800 shadow-sm flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              🚀 Espaço Colaborativo
            </div>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="https://ik.imagekit.io/bruumendes/27622626-b683-4d2e-92b9-d7f49d017f48.png"
              alt="Imagem Página Home"
              className="w-4/5 object-contain drop-shadow-xl"
            />
          </div>

        </div>
      </div>

      <div className="container mx-auto px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">

          <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100 text-center transform hover:-translate-y-1 transition-all duration-300">
            <span className="block text-3xl font-black text-slate-800 tracking-tight">+10</span>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold block mt-1">
              Resumos Criados
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#5ea2df] text-center transform hover:-translate-y-1 transition-all duration-300">
            <span className="block text-3xl font-black text-[#5ea2df] tracking-tight">0h</span>
            <span className="text-xs text-slate-500 font-mono uppercase tracking-wider font-bold block mt-1">
              Conteúdo em Vídeo
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100 text-center transform hover:-translate-y-1 transition-all duration-300">
            <span className="block text-3xl font-black text-slate-800 tracking-tight">23</span>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-bold block mt-1">
              Projetos no GitHub
            </span>
          </div>

        </div>
      </div>

      <div className="pt-12">
        <ListaPostagens />
      </div>
    </>
  )
}

export default Home;