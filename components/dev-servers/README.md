# Feature: Servidores (dev)

## Propósito
Painel administrativo para start/stop/restart dos serviços de desenvolvimento (backend, admin, web) sem sair do admin. Para uso interno em dev.

## Páginas
- `app/servidores/page.tsx`

## Componentes
- `server-manager.tsx` — UI principal

## Backend consumido
Roteia para o **services-manager** (porta 3010, serviço Node próprio em `services-manager/` na raiz do projeto, fora dos 4 repos).

## Gotchas
- Existe um warning de tipo pré-existente em `server-manager.tsx` (variantes de Badge/Button) — não bloqueia funcionalidade, mas pode quebrar `next build`. Item em `producao_gaps.md`.
- Esta feature é **dev-only** — não publicar em produção sem revisão.
