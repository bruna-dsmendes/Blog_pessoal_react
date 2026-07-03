import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../../contexts/AuthContext"
import { ToastAlerta } from "../../utils/ToastAlerta"

function Perfil() {
  const navigate = useNavigate()

  const { usuario } = useContext(AuthContext)

  useEffect(() => {
    if (usuario.token === "") {
      ToastAlerta("Você precisa estar logado", 'info')
      navigate("/")
    }
  }, [usuario.token])

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
          src={usuario.foto}
          alt={`Foto de perfil de ${usuario.nome}`}
        />

        <div
          className="relative mt-[-6rem]h-72 flex flex-col 
                    bg-pink-50 text-slate-700 text-2xl items-center justify-center"
        >
          <p>Nome: {usuario.nome} </p>
          <p>Email: {usuario.usuario}</p>
        </div>
      </div>
    </div>
  )

}

export default Perfil