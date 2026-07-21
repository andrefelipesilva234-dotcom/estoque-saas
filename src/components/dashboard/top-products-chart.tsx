"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface TopProductsChartProps {
  data: {
    productName: string;
    total: number;
  }[];
}

export function TopProductsChart({
  data,
}: TopProductsChartProps) {
  const hasProducts = data.length > 0;

  function formatProductName(
    productName: string
  ) {
    const maximumLength = 18;

    if (
      productName.length <=
      maximumLength
    ) {
      return productName;
    }

    return `${productName.slice(
      0,
      maximumLength
    )}...`;
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="mb-5 sm:mb-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Produtos Mais Movimentados
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Os cinco produtos com maior número de movimentações
        </p>
      </header>

      {!hasProducts ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-slate-50 px-4 text-center sm:min-h-[320px]">
          <h3 className="text-base font-semibold text-slate-900">
            Nenhuma movimentação registrada
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500">
            Os produtos mais movimentados aparecerão aqui após as primeiras
            entradas, saídas ou perdas.
          </p>
        </div>
      ) : (
        <div className="h-[300px] min-w-0 sm:h-[350px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            debounce={100}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 8,
                right: 18,
                left: 0,
                bottom: 0,
              }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "#64748B",
                }}
                axisLine={{
                  stroke: "#CBD5E1",
                }}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="productName"
                width={115}
                tickFormatter={
                  formatProductName
                }
                tick={{
                  fontSize: 11,
                  fill: "#475569",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "#F8FAFC",
                }}
                formatter={(value) => [
                  value,
                  "Movimentações",
                ]}
                labelFormatter={(label) =>
                  `Produto: ${label}`
                }
                contentStyle={{
                  borderRadius: "12px",
                  border:
                    "1px solid #E2E8F0",
                  boxShadow:
                    "0 10px 25px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Bar
                dataKey="total"
                name="Movimentações"
                fill="#2563EB"
                radius={[0, 6, 6, 0]}
                maxBarSize={38}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}