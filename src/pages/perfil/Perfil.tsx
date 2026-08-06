import { useContext } from "react"
import { Link } from "react-router-dom"

import { AuthContext } from "../../contexts/AuthContext"
//import { ToastAlerta } from "../../utils/ToastAlerta"

function Perfil() {

  // A RotaProtegida já garante que existe sessão antes de chegar aqui.
  const { usuario } = useContext(AuthContext)

  if (!usuario) return null

  return (
    <div className="flex justify-center mx-4">
      <div className="container mx-auto my-4 rounded-2xl overflow-hidden">
        <img
          className="w-full h-65 object-contain bg-pink-100 border-b-8 border-white"
          src="https://ik.imagekit.io/bruumendes/Gemini_Generated_Image_4tkix54tkix54tki.png"
          alt="Capa do Perfil"
        />

        <img
          className="rounded-full w-56 mx-auto mt-[-8rem]border-8 border-white relative z-10"
          src={usuario.foto ?? undefined}
          alt={`Foto de perfil de ${usuario.nome}`}
        />

        <div
          className="relative mt-[-6rem]h-auto flex flex-col 
                    bg-pink-50 text-slate-700 text-2xl items-center justify-center pb-8"
        >
          <p className="mt-8">Nome: {usuario.nome} </p>
          <p>Email: {usuario.usuario}</p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/perfil/editar"
              className="rounded bg-sky-200 hover:bg-sky-300 text-sky-900 
                         py-2 px-6 font-bold transition-colors"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Perfil
