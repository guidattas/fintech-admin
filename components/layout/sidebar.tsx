"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Store,
  Tags,
  Users,
  ArrowLeftRight,
  Send,
  Wallet,
  Receipt,
  Smartphone,
  Plug,
  BarChart3,
  Headphones,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Server,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { setStoredToken } from "@/lib/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarItem,
  type SidebarMenuItem,
} from "@/components/layout/sidebar-item";

export const SIDEBAR_ITEMS: SidebarMenuItem[] = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Estabelecimentos", icon: Store, href: "/estabelecimentos" },
  { title: "Planos e tarifas", icon: Tags, href: "/planos-e-tarifas" },
  { title: "Representantes", icon: Users, href: "/representantes" },
  { title: "Transações", icon: ArrowLeftRight, href: "/transacoes" },
  { title: "Transferências", icon: Send, href: "/transferencias" },
  { title: "Pagamentos", icon: Wallet, href: "/pagamentos" },
  { title: "Cobranças", icon: Receipt, href: "/cobrancas" },
  { title: "Equipamentos", icon: Smartphone, href: "/equipamentos" },
  { title: "Integração", icon: Plug, href: "/integracao" },
  { title: "Relatórios", icon: BarChart3, href: "/relatorios" },
  { title: "Suporte ao cliente", icon: Headphones, href: "/suporte" },
  { title: "Servidores", icon: Server, href: "/servidores" },
  { title: "Ajuda", icon: HelpCircle, href: "/ajuda" },
];

const EXPANDED_WIDTH = 256;
const COLLAPSED_WIDTH = 76;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  className?: string;
  variant?: "fixed" | "static";
}

export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
  className,
  variant = "fixed",
}: SidebarProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const handleLogout = () => {
    setStoredToken(null);
    router.replace("/login");
  };

  const ToggleIcon: LucideIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <TooltipProvider delayDuration={120}>
      <motion.aside
        animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
        initial={false}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "flex h-screen flex-col border-r border-zinc-200 bg-zinc-50",
          variant === "fixed" && "sticky top-0",
          className
        )}
        aria-label="Navegação principal"
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-zinc-200 px-3",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 px-1"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                F
              </div>
              <span className="text-sm font-semibold text-zinc-900">
                Fintech
              </span>
            </motion.div>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            <ToggleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {SIDEBAR_ITEMS.map((item) => (
              <li key={item.href}>
                <SidebarItem
                  item={item}
                  active={isActive(item.href)}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={cn(
            "border-t border-zinc-200 p-3",
            collapsed && "flex justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg",
              !collapsed && "px-2 py-1.5"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
              A
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="min-w-0"
              >
                <p className="truncate text-sm font-medium text-zinc-900">
                  Admin
                </p>
                <p className="truncate text-xs text-zinc-500">
                  admin@fintech.com
                </p>
              </motion.div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair"
            title="Sair"
            className={cn(
              "mt-2 inline-flex items-center gap-2 rounded-md text-sm text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60",
              collapsed ? "h-9 w-9 justify-center" : "w-full px-2 py-1.5"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
