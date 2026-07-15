"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
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
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Movimentações dos Últimos 30 Dias
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Entradas, saídas e perdas registradas
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
              }}
            />

            <YAxis
              tick={{
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#16A34A"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="saidas"
              stroke="#D97706"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="perdas"
              stroke="#DC2626"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}