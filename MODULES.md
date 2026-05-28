# Admin — Convenção módulo-por-feature

Cada feature do admin é um **módulo**, com:
- Pasta de rota em `app/<feature>/`
- Pasta de componentes em `components/<feature>/`
- Um README descrevendo propósito, endpoints consumidos, dependências

## Features atuais

| Feature | Rota | Componentes | README |
|---|---|---|---|
| Login | `app/login/` | `components/auth/` | [auth/README.md](./components/auth/README.md) |
| Estabelecimentos | `app/estabelecimentos/` | `components/establishments/` | [establishments/README.md](./components/establishments/README.md) |
| Servidores (dev) | `app/servidores/` | `components/dev-servers/` | [dev-servers/README.md](./components/dev-servers/README.md) |
| Layout (transversal) | — | `components/layout/` | [layout/README.md](./components/layout/README.md) |
| UI primitives | — | `components/ui/` | (Radix + variantes — sem README específico) |

## Stack
- Next.js 16 (App Router, breaking changes — ver `AGENTS.md` na raiz)
- React Query
- Radix UI
- Tailwind 4 (postcss)
- Zod + react-hook-form
- Sonner (toasts)

## Auth client-side
Token em `localStorage` (`admin:access-token`). Guard em `components/auth/auth-gate.tsx` redireciona para `/login` quando não há sessão. Interceptor 401 em `lib/api.ts` limpa sessão automaticamente.

## Como criar uma feature nova
Use a skill **`feature-modulo-novo`**. Ela cria:
1. `app/<feature>/page.tsx` + sub-rotas
2. `components/<feature>/<feature>-listing.tsx`, `-detail.tsx`, etc.
3. README aqui linkado

## Skills relacionadas
- `feature-modulo-novo` — criar feature nova
- `paytime-integracao-endpoint` — quando precisar de endpoint backend novo
