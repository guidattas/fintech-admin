import { Suspense } from "react";
import { ServerManager } from "@/components/dev-servers/server-manager";

export default function ServidoresPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Gerenciamento de Servidores
        </h1>
        <p className="text-sm text-zinc-500">
          Monitorar e controlar os servidores de desenvolvimento
        </p>
      </header>

      <Suspense fallback={<div className="text-sm text-zinc-500">Carregando servidores...</div>}>
        <ServerManager />
      </Suspense>
    </div>
  );
}
