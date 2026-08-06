# Migração do front

Front adaptado ao backend com sessão em cookie httpOnly, artigos em markdown,
tags e ciclo de rascunho e publicação.

Verificado com `npx tsc -b --noEmit` e `npm run build`, ambos limpos.

## O que mudou de conceito

**O front não conhece mais o token.** Não existe `usuario.token`. A sessão vive
num cookie que o JavaScript não consegue ler, e o navegador o envia sozinho.

**Quem responde "estou logada?" é o servidor.** No boot, o `AuthContext` chama
`/usuarios/me`. Se voltar 200, existe sessão. Efeito colateral bom: recarregar a
página deixou de deslogar.

**A leitura ficou pública.** A rota `/` é o feed, não mais o login. Só escrita e
perfil exigem sessão, através do componente `RotaProtegida`.

## Arquivos novos

| Arquivo | Papel |
|---|---|
| `vercel.json` | Rewrite `/api/*` para o Render. **Troque a URL** |
| `vite.config.ts` | Proxy `/api` para `localhost:8080`, o equivalente local do rewrite |
| `services/api.ts` | Instância do axios com `withCredentials` e interceptor de 401 |
| `services/usuarioService.ts` | Cadastro, login, logout, perfil |
| `services/postagemService.ts` | Feed, busca, tags, rascunhos, publicar, arquivar |
| `services/tagService.ts` | Listagem e busca de tags |
| `models/Pagina.ts` | Envelope de paginação |
| `models/Tag.ts` | Tag |
| `routes/RotaProtegida.tsx` | Espera a sessão carregar antes de decidir |
| `pages/artigo/Artigo.tsx` | Leitura do artigo, renderizando markdown |
| `pages/minhaspostagens/MinhasPostagens.tsx` | Painel de rascunhos e publicação |
| `pages/portag/PorTag.tsx` | Feed filtrado por tag |

## Arquivos removidos

`services/Service.ts`, `models/Tema.ts`, `models/UsuarioLogin.ts`,
`components/tema/` inteiro, `components/postagem/modalpostagem/`,
`components/postagem/deletarpostagem/`, `components/perfil/deletarperfil/`.

O `DeletarPerfil` saiu porque a API nunca teve endpoint de exclusão de usuário.
O botão existia mas não funcionava. Se você quiser essa funcionalidade, ela
precisa nascer no backend primeiro.

Também renomeei `pages/perfil/ Perfil.tsx`, que tinha um espaço no começo do
nome. Funciona no Mac, quebra em build Linux.

## Por que o rewrite é obrigatório

Front na Vercel e API no Render são domínios diferentes. Nesse cenário o cookie
da API é cookie de terceiro, e o Safari bloqueia. O rewrite faz o navegador
enxergar tudo saindo do domínio da Vercel, então o cookie vira primeiro e o CORS
deixa de ser necessário.

**Antes de subir, edite o `vercel.json`** e troque `SEU-BACKEND.onrender.com`
pela URL real.

O `vite.config.ts` faz a mesma coisa em desenvolvimento. Por isso não existe
mais `VITE_API_URL`: a `baseURL` é `/api`, relativa.

## Rotas

| Rota | Acesso |
|---|---|
| `/` | pública, feed |
| `/artigo/:slug` | pública |
| `/tag/:slug` | pública |
| `/login`, `/cadastro` | pública |
| `/minhas-postagens` | sessão |
| `/postagens/nova`, `/postagens/:id/editar` | sessão |
| `/perfil`, `/perfil/editar` | sessão |

`/home` e `/postagens` redirecionam para `/`, porque já circularam em links.

## Segurança do markdown

O `react-markdown` não renderiza HTML embutido por padrão. Uma tag `<img
onerror=...>` escrita dentro do markdown vira texto, não vira script.

Habilitar `rehype-raw` abriria exatamente o buraco que estamos evitando. Não
adicione esse plugin antes da sanitização entrar no backend.

## O que ainda falta

- Autocomplete de tags no editor usando `tagService.buscarPorNome`
- Busca por termo na interface, o `postagemService.buscar` já existe
- Sanitização do markdown no backend, Fase 3
- O bundle passou de 500 kB. Vale carregar o `react-markdown` com `import()`
  dinâmico, já que só o artigo e o preview precisam dele
