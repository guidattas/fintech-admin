# Feature transversal: Layout

## Propósito
Moldura do admin: sidebar (com items de navegação e logout), header mobile com sheet, dashboard shell.

## Componentes
- `dashboard-layout.tsx` — shell com sidebar fixo (desktop) + sheet (mobile)
- `sidebar.tsx` — items de navegação + perfil + botão "Sair"
- `sidebar-item.tsx` — item individual com ícone + tooltip + active state

## Items do menu
Definidos como `SIDEBAR_ITEMS` em `sidebar.tsx`. Hoje:
- Home, Estabelecimentos, Planos e tarifas, Representantes, Transações, Transferências, Pagamentos, Cobranças, Equipamentos, Integração, Relatórios, Suporte, Servidores, Ajuda.

Muitos itens **ainda não têm página correspondente** — eles aparecem mas levam a 404. Limpar ou criar conforme prioridade do produto.

## Gotchas
- Sidebar colapsa/expande com estado em `localStorage` (`admin:sidebar-collapsed`).
- Logout: chama `setStoredToken(null)` + `router.replace('/login')`. **Não fazer fetch para o backend** — o JWT é stateless do nosso lado (Paytime ainda mantém sessão até expirar, ver `login_paytime_config.md`).
- A `DashboardLayout` é wrappada pelo `AuthGate` (em `app/layout.tsx`), não diretamente.
