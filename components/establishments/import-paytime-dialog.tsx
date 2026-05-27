"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImportPaytimeEstablishments } from "@/hooks/use-establishments";
import type { PaytimeImportSummary } from "@/lib/types/establishment";

interface ImportPaytimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportPaytimeDialog({
  open,
  onOpenChange,
}: ImportPaytimeDialogProps) {
  const mutation = useImportPaytimeEstablishments();
  const [summary, setSummary] = React.useState<PaytimeImportSummary | null>(
    null,
  );

  React.useEffect(() => {
    if (!open) {
      setSummary(null);
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleImport() {
    try {
      const result = await mutation.mutateAsync();
      setSummary(result);
    } catch {
      // toast already triggered by hook
    }
  }

  const issueCount =
    (summary?.skipped.length ?? 0) + (summary?.errors.length ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar estabelecimentos da Paytime</DialogTitle>
          <DialogDescription>
            Busca todos os estabelecimentos no marketplace Paytime e faz upsert
            local. Operação idempotente (identifica por paytimeId ou CNPJ).
          </DialogDescription>
        </DialogHeader>

        {summary ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryStat label="Encontrados" value={summary.fetched} />
              <SummaryStat
                label="Criados"
                value={summary.created}
                tone="success"
              />
              <SummaryStat
                label="Atualizados"
                value={summary.updated}
                tone="info"
              />
              <SummaryStat
                label="Issues"
                value={issueCount}
                tone={issueCount ? "warning" : "default"}
              />
            </div>

            {summary.skipped.length > 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="mb-2 flex items-center gap-2 font-medium text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  {summary.skipped.length} estabelecimento(s) pulado(s)
                </p>
                <ul className="space-y-1 text-xs text-amber-900">
                  {summary.skipped.slice(0, 5).map((item, idx) => (
                    <li key={`${item.paytimeId}-${idx}`}>
                      <strong>#{item.paytimeId ?? "?"}:</strong> {item.reason}
                    </li>
                  ))}
                  {summary.skipped.length > 5 ? (
                    <li>… e mais {summary.skipped.length - 5}</li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {summary.errors.length > 0 ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
                <p className="mb-2 flex items-center gap-2 font-medium text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  {summary.errors.length} erro(s) durante upsert
                </p>
                <ul className="space-y-1 text-xs text-red-900">
                  {summary.errors.slice(0, 5).map((item, idx) => (
                    <li key={`${item.paytimeId}-${idx}`}>
                      <strong>#{item.paytimeId ?? "?"}:</strong> {item.message}
                    </li>
                  ))}
                  {summary.errors.length > 5 ? (
                    <li>… e mais {summary.errors.length - 5}</li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {issueCount === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                Importação concluída sem nenhum aviso.
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Antes de prosseguir, garanta que a integração Paytime está
            configurada no backend (variáveis de ambiente e credenciais).
          </div>
        )}

        <DialogFooter>
          {summary ? (
            <>
              <Button variant="outline" onClick={() => setSummary(null)}>
                Importar novamente
              </Button>
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importando…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Iniciar importação
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "info" | "warning";
}) {
  const toneClasses = {
    default: "border-zinc-200 bg-white text-zinc-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  }[tone];

  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClasses}`}>
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-xl font-semibold">{value.toLocaleString("pt-BR")}</p>
    </div>
  );
}
