"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { hasSession } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

/**
 * Guard de autenticação client-side.
 *
 * - Rota /login: renderiza a página sem a moldura do dashboard e sem exigir sessão.
 * - Demais rotas: exige token de sessão no localStorage; caso contrário
 *   redireciona para /login. Enquanto verifica, não renderiza o conteúdo
 *   protegido (evita flash de dados antes do redirect).
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/login";

  const [authed, setAuthed] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (isLoginRoute) {
      setChecked(true);
      return;
    }
    if (hasSession()) {
      setAuthed(true);
      setChecked(true);
    } else {
      router.replace("/login");
    }
  }, [isLoginRoute, pathname, router]);

  // Página de login: sem dashboard, sem exigência de sessão.
  if (isLoginRoute) {
    return <>{children}</>;
  }

  // Verificando ou redirecionando: não vaza conteúdo protegido.
  if (!checked || !authed) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
