import { FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";

function Footer() {
  let data = new Date().getFullYear()

  return (
    <>
      <div className="flex justify-center bg-[#00B7EB] text-white">
        <div className="container flex flex-col items-center py-4">
          <p className="text-xl font-bold">
            Blog Pessoal Bruna Mendes | Copyrigt: {data} </p>
          <p className="text-lg">Acesse minhas redes sociais </p>
          <div className="flex gap-2">
            <LinkedinLogoIcon size={48} weight="bold" />
            <InstagramLogoIcon size={48} weight="bold" />
            <FacebookLogoIcon size={48} weight="bold" />
          </div>
        </div>
      </div>


    </>
  )
}

export default Footer