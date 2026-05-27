"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useEstablishmentsList } from "@/hooks/use-establishments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { EstablishmentsFilters } from "@/components/establishments/establishments-filters";
import { EstablishmentsTable } from "@/components/establishments/establishments-table";
import { MetricsCards } from "@/components/establishments/metrics-cards";
import { DeleteEstablishmentDialog } from "@/components/establishments/delete-establishment-dialog";
import { ImportPaytimeDialog } from "@/components/establishments/import-paytime-dialog";
import type {
  EstablishmentStatus,
  EstablishmentSummary,
} from "@/lib/types/establishment";

const PAGE_SIZE = 10;

export function EstablishmentsListing() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<EstablishmentStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] =
    React.useState<EstablishmentSummary | null>(null);
  const [importOpen, setImportOpen] = React.useState(false);

  const debouncedSearch = useDebouncedValue(search, 350);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, isLoading, isFetching, isError, refetch } =
    useEstablishmentsList({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      status: status === "ALL" ? undefined : status,
    });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hasActiveFilters = Boolean(debouncedSearch.trim()) || status !== "ALL";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Estabelecimentos
          </h1>
          <p className="text-sm text-zinc-500">
            Gerencie todos os estabelecimentos cadastrados na fintech.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Download className="h-4 w-4" />
            Importar Paytime
          </Button>
          <Button asChild>
            <Link href="/estabelecimentos/novo">
              <Plus className="h-4 w-4" />
              Novo estabelecimento
            </Link>
          </Button>
        </div>
      </header>

      <MetricsCards data={items} totalAll={total} loading={isLoading} />

      <div className="flex flex-col gap-4">
        <EstablishmentsFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onClear={() => {
            setSearch("");
            setStatus("ALL");
          }}
          hasActiveFilters={hasActiveFilters}
        />

        {isError ? (
          <EmptyState
            icon={Store}
            title="Não foi possível carregar"
            description="Verifique se o backend está em execução e tente novamente."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
            }
          />
        ) : !isLoading && items.length === 0 ? (
          <EmptyState
            icon={Store}
            title="Nenhum estabelecimento encontrado"
            description={
              hasActiveFilters
                ? "Ajuste os filtros ou limpe a busca para ver mais resultados."
                : "Cadastre o primeiro estabelecimento para começar."
            }
            action={
              <Button asChild>
                <Link href="/estabelecimentos/novo">
                  <Plus className="h-4 w-4" />
                  Novo estabelecimento
                </Link>
              </Button>
            }
          />
        ) : (
          <EstablishmentsTable
            data={items}
            loading={isLoading}
            onDelete={(item) => setPendingDelete(item)}
          />
        )}

        {items.length > 0 ? (
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <div>
              {isFetching && !isLoading ? "Atualizando…" : null}
              {!isFetching ? (
                <>
                  Mostrando{" "}
                  <strong className="text-zinc-900">{items.length}</strong> de{" "}
                  <strong className="text-zinc-900">
                    {total.toLocaleString("pt-BR")}
                  </strong>{" "}
                  estabelecimento(s)
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-xs text-zinc-500">
                Página <strong className="text-zinc-900">{page}</strong> de{" "}
                <strong className="text-zinc-900">{totalPages}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <DeleteEstablishmentDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        establishmentId={pendingDelete?.id ?? null}
        brandName={pendingDelete?.brandName}
      />

      <ImportPaytimeDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
