import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EstablishmentForm } from "@/components/establishments/form/establishment-form";

export const metadata = {
  title: "Novo estabelecimento · Fintech Admin",
};

export default function NewEstablishmentPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <Link
          href="/estabelecimentos"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para estabelecimentos
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          Novo estabelecimento
        </h1>
        <p className="text-sm text-zinc-500">
          Preencha os dados do estabelecimento. Campos com{" "}
          <span className="text-red-500">*</span> são obrigatórios.
        </p>
      </div>

      <EstablishmentForm mode="create" />
    </div>
  );
}
