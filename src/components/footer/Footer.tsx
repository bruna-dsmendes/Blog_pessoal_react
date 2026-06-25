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
            <a href="https://www.linkedin.com/in/devbrunamendes/" target="_blank">
              <LinkedinLogoIcon size={48} weight="bold" /> </a>
            <a href="https://www.instagram.com/bruumends/" target="_blank">
              <InstagramLogoIcon size={48} weight="bold" /> </a>
            <a href="https://www.facebook.com/brumends/" target="_blank">
              <FacebookLogoIcon size={48} weight="bold" /></a>
          </div>
        </div>
      </div>


    </>
  )
}

export default Footer