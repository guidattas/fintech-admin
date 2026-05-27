import { Calendar, RefreshCcw } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatDateTimeBR } from "@/lib/utils";

interface EstablishmentTimelineProps {
  createdAt: string;
  updatedAt: string;
}

export function EstablishmentTimeline({
  createdAt,
  updatedAt,
}: EstablishmentTimelineProps) {
  const entries = [
    {
      icon: Calendar,
      label: "Cadastrado em",
      value: formatDateTimeBR(createdAt),
      tone: "bg-blue-100 text-blue-700",
    },
    {
      icon: RefreshCcw,
      label: "Última atualização",
      value: formatDateTimeBR(updatedAt),
      tone: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-zinc-500">Histórico</p>
      <ol className="mt-4 space-y-4">
        {entries.map(({ icon: Icon, label, value, tone }) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {label}
              </p>
              <p className="text-sm font-medium text-zinc-900">{value}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
