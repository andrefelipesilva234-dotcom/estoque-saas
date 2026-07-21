interface ExecutiveSummaryProps {
  stockHealth: number;
  lowStockProducts: number;
  totalPerdas: number;
}

export function ExecutiveSummary({
  stockHealth,
  lowStockProducts,
  totalPerdas,
}: ExecutiveSummaryProps) {
  const normalizedStockHealth = Math.min(
    100,
    Math.max(0, stockHealth)
  );

  const stockHealthStatus =
    normalizedStockHealth >= 95
      ? {
          label: "Excelente",
          textClass: "text-green-700",
          badgeClass:
            "bg-green-100 text-green-700",
          barClass: "bg-green-500",
        }
      : normalizedStockHealth >= 80
        ? {
            label: "Atenção",
            textClass: "text-amber-700",
            badgeClass:
              "bg-amber-100 text-amber-700",
            barClass: "bg-amber-500",
          }
        : {
            label: "Crítico",
            textClass: "text-red-700",
            badgeClass:
              "bg-red-100 text-red-700",
            barClass: "bg-red-500",
          };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Resumo Operacional
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Indicadores principais da situação atual do estoque
        </p>
      </header>

      <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
        <article className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Saúde do Estoque
              </p>

              <p
                className={`mt-2 text-3xl font-bold sm:text-4xl ${stockHealthStatus.textClass}`}
              >
                {normalizedStockHealth}%
              </p>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockHealthStatus.badgeClass}`}
            >
              {stockHealthStatus.label}
            </span>
          </div>

          <div className="mt-5">
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Saúde do estoque"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={normalizedStockHealth}
            >
              <div
                className={`h-full rounded-full transition-all ${stockHealthStatus.barClass}`}
                style={{
                  width: `${normalizedStockHealth}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Percentual de produtos dentro do nível ideal
            </p>
          </div>
        </article>

        <article
          className={
            lowStockProducts > 0
              ? "bg-red-50/50 p-4 sm:p-6"
              : "p-4 sm:p-6"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Produtos em Alerta
              </p>

              <p
                className={
                  lowStockProducts > 0
                    ? "mt-2 text-3xl font-bold text-red-600 sm:text-4xl"
                    : "mt-2 text-3xl font-bold text-green-600 sm:text-4xl"
                }
              >
                {lowStockProducts}
              </p>
            </div>

            <span
              className={
                lowStockProducts > 0
                  ? "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                  : "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
              }
            >
              {lowStockProducts > 0
                ? "Requer atenção"
                : "Tudo normal"}
            </span>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Produtos no limite ou abaixo do estoque mínimo
          </p>
        </article>

        <article
          className={
            totalPerdas > 0
              ? "bg-amber-50/50 p-4 sm:p-6"
              : "p-4 sm:p-6"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Perdas Registradas
              </p>

              <p
                className={
                  totalPerdas > 0
                    ? "mt-2 text-3xl font-bold text-amber-600 sm:text-4xl"
                    : "mt-2 text-3xl font-bold text-green-600 sm:text-4xl"
                }
              >
                {totalPerdas}
              </p>
            </div>

            <span
              className={
                totalPerdas > 0
                  ? "inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                  : "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
              }
            >
              {totalPerdas > 0
                ? "Com ocorrências"
                : "Sem perdas"}
            </span>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Quantidade de movimentações classificadas como perda
          </p>
        </article>
      </div>
    </section>
  );
}