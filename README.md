# Admin · Fintech

Painel administrativo (Next.js 16 · Tailwind 4 · TanStack Query · React Hook Form · Zod · Sonner) que consome a API NestJS em `../backend`.

## Funcionalidades — Estabelecimentos

- Listagem paginada com busca, filtro por status, cards de métricas, badges, avatares e ações em dropdown.
- Tela de detalhes com tabs: **Dados principais**, **Responsável**, **Banking**, **Limites**, **Permissões**, **Configurações de venda**, **3DS** e **Documentos** + timeline de cadastro.
- Formulário de criar / editar (tabs idem) com validação Zod, switches de permissão, máscaras de CNPJ/CPF/CEP e gestão dinâmica de documentos.
- Exclusão com dialog de confirmação e feedback via toasts.
- Integração 100% REST com `GET /establishments`, `GET /establishments/:id`, `POST /establishments`, `PATCH /establishments/:id`, `DELETE /establishments/:id`.

## Variáveis de ambiente

Copie o exemplo e ajuste:

```bash
cp .env.local.example .env.local
```

| Variável                  | Descrição                                            |
| ------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`| URL base da API NestJS (default `http://localhost:3000`). |
| `NEXT_PUBLIC_DEV_TOKEN`   | JWT usado como `Authorization: Bearer` enquanto não há tela de login. Obtenha via `POST /auth/login`. |

Como obter o token (`backend` em execução):

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Admin","email":"admin@dattas.com.br","password":"123456"}'

curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@dattas.com.br","password":"123456"}'
# → copie access_token para NEXT_PUBLIC_DEV_TOKEN
```

## Rodando localmente

```bash
npm install
npm run dev
# abre em http://localhost:3000 (ou outra porta livre)
```

> O backend roda em `:3000` por padrão. Se quiser evitar conflito, suba o admin em `:3001` com `PORT=3001 npm run dev`.

## Estrutura

```
admin/
├── app/
│   ├── layout.tsx              # root layout + Providers + DashboardLayout
│   ├── providers.tsx           # QueryClientProvider + Toaster
│   ├── globals.css
│   ├── page.tsx                # dashboard home
│   └── estabelecimentos/
│       ├── page.tsx            # listagem
│       ├── novo/page.tsx       # criar
│       └── [id]/
│           ├── page.tsx        # detalhes (tabs)
│           └── editar/page.tsx # editar
├── components/
│   ├── layout/                 # DashboardLayout, Sidebar, SidebarItem
│   ├── ui/                     # primitives (button, card, table, tabs, switch, …)
│   └── establishments/
│       ├── establishments-listing.tsx
│       ├── establishments-table.tsx
│       ├── establishments-filters.tsx
│       ├── establishment-detail.tsx
│       ├── establishment-edit.tsx
│       ├── establishment-timeline.tsx
│       ├── delete-establishment-dialog.tsx
│       ├── metrics-cards.tsx
│       ├── status-badge.tsx
│       ├── responsible-avatar.tsx
│       └── form/
│           ├── establishment-form.tsx
│           ├── section-card.tsx
│           ├── form-field.tsx
│           └── sections/       # main, address, responsible, banking, limits, permissions, sales-plan, documents
├── hooks/
│   ├── use-establishments.ts   # TanStack Query
│   └── use-debounced-value.ts
├── lib/
│   ├── api.ts                  # axios + Bearer token
│   ├── utils.ts                # cn + formatadores (BRL, CNPJ, CPF, CEP, datas)
│   ├── constants/establishment.ts  # catálogos (limites, permissões, status, UFs)
│   ├── services/establishments.ts  # chamadas REST
│   ├── types/establishment.ts
│   └── validation/establishment.ts # Zod
```

## Comandos úteis

```bash
npm run dev        # ambiente de desenvolvimento
npm run build      # build de produção
npm run start      # servidor de produção
npx tsc --noEmit   # checagem de tipos
```
