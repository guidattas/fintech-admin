export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Home
        </h1>
        <p className="text-sm text-zinc-500">
          Bem-vindo ao painel administrativo. Use o menu lateral para
          navegar.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Transações hoje", value: "R$ 128.450" },
          { label: "Estabelecimentos ativos", value: "2.317" },
          { label: "Cobranças em aberto", value: "84" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
