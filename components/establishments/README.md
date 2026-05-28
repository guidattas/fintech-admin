# Feature: Estabelecimentos

## Propósito
Gestão de estabelecimentos da credenciadora — listar, detalhar, criar, editar, importar da Paytime.

## Páginas
- `app/estabelecimentos/page.tsx` — listagem
- `app/estabelecimentos/novo/page.tsx` — formulário de criação
- `app/estabelecimentos/[id]/page.tsx` — detalhe

## Componentes principais
- `establishments-listing.tsx` — orquestra tabela + filtros + métricas + import
- `establishments-table.tsx`, `establishments-filters.tsx`
- `establishment-detail.tsx` — tela de detalhe; inclui **box "Credenciadora"** abaixo do `EstablishmentTimeline` (ver ADR 0003)
- `establishment-edit.tsx`
- `establishment-timeline.tsx` — "Histórico"
- `metrics-cards.tsx`, `status-badge.tsx`, `responsible-avatar.tsx`
- `import-paytime-dialog.tsx` — importação manual
- `delete-establishment-dialog.tsx`
- `form/` — composição de formulário, sections, fields

## Backend consumido
- `GET /establishments` (com filtros/paginação)
- `GET /establishments/:id`
- `POST /establishments`, `PATCH /establishments/:id`, `DELETE /establishments/:id`
- `POST /establishments/import/paytime`

## Gotchas
- Dados de estabelecimento são espelhados da Paytime no backend — **não duplicar** essa lógica aqui.
- Box "Credenciadora" lê de `establishment.credenciadoraNome` e `credenciadoraCnpj` (vindos do backend). CNPJ formatado via `formatCNPJ` do `lib/utils.ts`.
- O `tsconfig` do projeto pode reclamar de variantes em `dev-servers/server-manager.tsx` — **pré-existente, não relacionado**.

## Skills relacionadas
- `feature-modulo-novo`, `dado-paytime-ou-local`.
