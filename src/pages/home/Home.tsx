import ListaPostagens from "../../components/postagem/listapostagens/ListaPostagens";

function Home() {
  return (
    <>
      <div className="bg-sky-100">
        <div className="container grid grid-cols-2 text-sky-900">
          <div className="flex flex-col gap-4 items-center justify-center py-4">
            <h2 className="text-5xl font-bold"> Seja Bem Vindo! </h2>

            <p className="text-xl"> Faça seu registro de aprendizagem. </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://ik.imagekit.io/bruumendes/27622626-b683-4d2e-92b9-d7f49d017f48.png"
              alt="Imagem Página Home"
              className="w-2/3"
            />
          </div>
        </div>
      </div>

      <ListaPostagens />

    </>
  )
}

export default Home