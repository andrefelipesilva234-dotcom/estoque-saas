"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface MovementsChartProps {
  data: {
    date: string;
    entradas: number;
    saidas: number;
    perdas: number;
  }[];
}

export function MovementsChart({
  data,
}: MovementsChartProps) {
  const hasMovements = data.some(
    (item) =>
      item.entradas > 0 ||
      item.saidas > 0 ||
      item.perdas > 0
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="mb-5 sm:mb-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Movimentações dos Últimos 30 Dias
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Entradas, saídas e perdas registradas
        </p>
      </header>

      {!hasMovements ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-slate-50 px-4 text-center sm:min-h-[320px]">
          <h3 className="text-base font-semibold text-slate-900">
            Nenhuma movimentação no período
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500">
            As entradas, saídas e perdas dos últimos 30 dias aparecerão neste
            gráfico.
          </p>
        </div>
      ) : (
        <div className="h-[280px] min-w-0 sm:h-[350px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            debounce={100}
          >
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: -20,
                bottom: 0,
              }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                minTickGap={24}
                interval="preserveStartEnd"
                tickMargin={10}
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
                allowDecimals={false}
                width={38}
                tick={{
                  fontSize: 11,
                  fill: "#64748B",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                labelFormatter={(label) =>
                  `Data: ${label}`
                }
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  boxShadow:
                    "0 10px 25px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="entradas"
                name="Entradas"
                stroke="#16A34A"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="saidas"
                name="Saídas"
                stroke="#D97706"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="perdas"
                name="Perdas"
                stroke="#DC2626"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}