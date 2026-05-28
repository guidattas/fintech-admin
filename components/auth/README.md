# Feature: Auth (login do admin)

## Propósito
Login/logout do admin. Guard de rotas (AuthGate) que isola `/login` da moldura do dashboard.

## Páginas
- `app/login/page.tsx` — formulário email+senha

## Componentes
- `auth-gate.tsx` — guard client-side. Pathname `/login` renderiza sem dashboard; demais exigem sessão (token no localStorage).

## Fluxo
1. Usuário em `/login` → POST `/auth/login-representante` no backend (com fallback para `/auth/login`).
2. Token salvo em `localStorage` (`admin:access-token`).
3. Redirect para `/`.
4. Em qualquer rota: AuthGate verifica `hasSession()`; sem sessão → redirect `/login`.
5. Logout: botão na sidebar → `setStoredToken(null)` → `/login`.

## Gotchas
- **Não chamar diretamente `/auth/login`** — use `authApi.login` (faz fallback automático para representante).
- O `NEXT_PUBLIC_DEV_TOKEN` (env) é fallback de conveniência mas **não vale como sessão real** para o AuthGate — `hasSession()` só checa localStorage.
- Interceptor 401 em `lib/api.ts` limpa sessão e redireciona — não duplicar lógica em catch local.

## Backend consumido
- `POST /auth/login-representante` (preferido)
- `POST /auth/login` (fallback)

## Skills relacionadas
- `paytime-portal-endpoint` — quando migrarmos o login para a API do portal Paytime.
