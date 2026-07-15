interface AlertsCenterProps {
  lowStockProducts: number;
  totalPerdas: number;
}

export function AlertsCenter({
  lowStockProducts,
  totalPerdas,
}: AlertsCenterProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Central de Alertas
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>
            Produtos abaixo do mínimo
          </span>

          <span className="font-bold text-red-600">
            {lowStockProducts}
          </span>
        </div>

        <div className="flex justify-between">
          <span>
            Perdas registradas
          </span>

          <span className="font-bold text-amber-600">
            {totalPerdas}
          </span>
        </div>

        <div className="flex justify-between">
          <span>
            Auditoria
          </span>

          <span className="font-bold text-green-600">
            Ativa
          </span>
        </div>
      </div>
    </div>
  );
}