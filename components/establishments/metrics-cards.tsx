"use client";

import { Building2, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/utils";
import type { EstablishmentSummary } from "@/lib/types/establishment";

interface MetricsCardsProps {
  data: EstablishmentSummary[] | undefined;
  totalAll?: number;
  loading?: boolean;
}

export function MetricsCards({ data, totalAll, loading }: MetricsCardsProps) {
  const total = totalAll ?? data?.length ?? 0;
  const enabled =
    data?.filter((item) => item.status === "ENABLED").length ?? 0;
  const disabled =
    data?.filter((item) => item.status === "DISABLED").length ?? 0;
  const avgRevenue =
    data && data.length > 0
      ? data.reduce((acc, item) => acc + (item.monthlyRevenue ?? 0), 0) /
        data.length
      : 0;

  const cards = [
    {
      label: "Total cadastrados",
      value: loading ? "—" : total.toLocaleString("pt-BR"),
      icon: Building2,
      tone: "text-blue-600 bg-blue-100",
    },
    {
      label: "Habilitados",
      value: loading ? "—" : enabled.toLocaleString("pt-BR"),
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Desabilitados",
      value: loading ? "—" : disabled.toLocaleString("pt-BR"),
      icon: XCircle,
      tone: "text-red-600 bg-red-100",
    },
    {
      label: "Faturamento médio (página)",
      value: loading ? "—" : formatCurrencyBRL(avgRevenue),
      icon: TrendingUp,
      tone: "text-amber-600 bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">
                {value}
              </p>
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
