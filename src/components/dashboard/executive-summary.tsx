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
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Resumo Operacional
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-slate-500">
            Saúde do Estoque
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stockHealth}%
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Produtos em Alerta
          </p>

          <p className="text-3xl font-bold text-red-600 mt-2">
            {lowStockProducts}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Perdas Registradas
          </p>

          <p className="text-3xl font-bold text-amber-600 mt-2">
            {totalPerdas}
          </p>
        </div>
      </div>
    </div>
  );
}