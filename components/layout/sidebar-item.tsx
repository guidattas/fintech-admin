"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SidebarMenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarItemProps {
  item: SidebarMenuItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({
  item,
  active,
  collapsed,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.title : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-400/60",
        collapsed && "justify-center px-0",
        active
          ? "bg-blue-100 text-blue-700"
          : "text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          active ? "text-blue-600" : "text-zinc-500 group-hover:text-zinc-700"
        )}
        aria-hidden="true"
      />

      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15 }}
          className="truncate"
        >
          {item.title}
        </motion.span>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
}
