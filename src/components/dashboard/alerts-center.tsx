import Link from "next/link";

interface AlertsCenterProps {
  lowStockProducts: number;
  totalPerdas: number;
}

export function AlertsCenter({
  lowStockProducts,
  totalPerdas,
}: AlertsCenterProps) {
  const hasAlerts =
    lowStockProducts > 0 ||
    totalPerdas > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Central de Alertas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Situações que precisam de acompanhamento
            </p>
          </div>

          <span
            className={
              hasAlerts
                ? "inline-flex shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                : "inline-flex shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
            }
          >
            {hasAlerts
              ? "Atenção"
              : "Tudo normal"}
          </span>
        </div>
      </header>

      <div className="divide-y divide-slate-200">
        <Link
          href="/alerts"
          className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-slate-50 sm:px-6"
        >
          <div className="min-w-0">
            <p className="font-medium text-slate-900">
              Produtos abaixo do mínimo
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Produtos que precisam de reposição
            </p>
          </div>

          <span
            className={
              lowStockProducts > 0
                ? "inline-flex min-w-10 shrink-0 items-center justify-center rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700"
                : "inline-flex min-w-10 shrink-0 items-center justify-center rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700"
            }
          >
            {lowStockProducts}
          </span>
        </Link>

        <Link
          href="/movements"
          className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-slate-50 sm:px-6"
        >
          <div className="min-w-0">
            <p className="font-medium text-slate-900">
              Perdas registradas
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Movimentações classificadas como perda
            </p>
          </div>

          <span
            className={
              totalPerdas > 0
                ? "inline-flex min-w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700"
                : "inline-flex min-w-10 shrink-0 items-center justify-center rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700"
            }
          >
            {totalPerdas}
          </span>
        </Link>

        <Link
          href="/audit"
          className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-slate-50 sm:px-6"
        >
          <div className="min-w-0">
            <p className="font-medium text-slate-900">
              Auditoria
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Registro de alterações críticas
            </p>
          </div>

          <span className="inline-flex shrink-0 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
            Ativa
          </span>
        </Link>
      </div>
    </section>
  );
}