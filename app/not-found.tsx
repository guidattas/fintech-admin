import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Em manutenção · Fintech Admin",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
        <Construction className="h-8 w-8" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Módulo em manutenção
        </h1>
        <p className="max-w-md text-sm text-zinc-500">
          Estamos finalizando os ajustes desta área do painel. Em breve ela
          estará disponível. Enquanto isso, você pode continuar navegando pelos
          demais módulos no menu lateral.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para a Home
      </Link>
    </div>
  );
}
