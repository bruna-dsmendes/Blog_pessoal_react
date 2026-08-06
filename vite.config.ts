import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  /*
   * O proxy é o equivalente local do rewrite da Vercel.
   *
   * Sem ele, o front em :5173 e a API em :8080 são origens diferentes, e o
   * cookie de sessão viraria cookie de terceiro. Com o proxy, o navegador vê
   * tudo saindo de localhost:5173 e trata o cookie como primeiro.
   */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (caminho) => caminho.replace(/^\/api/, ''),
      },
    },
  },
})
