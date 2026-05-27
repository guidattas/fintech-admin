"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { EstablishmentForm } from "@/components/establishments/form/establishment-form";
import { useEstablishment } from "@/hooks/use-establishments";

interface EstablishmentEditProps {
  id: string;
}

export function EstablishmentEdit({ id }: EstablishmentEditProps) {
  const { data, isLoading, isError, refetch } = useEstablishment(id);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <Link
          href={`/estabelecimentos/${id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para detalhes
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          Editar estabelecimento
        </h1>
        <p className="text-sm text-zinc-500">
          Atualize as informações do estabelecimento.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : isError || !data ? (
        <EmptyState
          icon={Building2}
          title="Não foi possível carregar"
          description="Verifique se o backend está em execução e tente novamente."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          }
        />
      ) : (
        <EstablishmentForm mode="edit" establishment={data} />
      )}
    </div>
  );
}
