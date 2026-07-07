import ListaPostagens from "../../components/postagem/listapostagens/ListaPostagens";

function Home() {
  return (
    <>
      <div className="border-b border-hairline">
        <div className="container mx-auto px-8 py-10 flex items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink leading-tight">
              Registros de uma jornada tech.
            </h1>
            <p className="text-ink-muted text-lg mt-3 leading-relaxed">
              Resumos, estudos e aprendizados compartilhados em grupo — o{" "}
              <span className="text-accent-dark font-medium">Simetria.Dev</span>.
            </p>
          </div>

          <img
            src="https://ik.imagekit.io/bruumendes/27622626-b683-4d2e-92b9-d7f49d017f48.png"
            alt="Simetria Dev"
            className="hidden md:block w-40 object-contain shrink-0"
          />
        </div>
      </div>

      <ListaPostagens />
    </>
  )
}

export default Home;