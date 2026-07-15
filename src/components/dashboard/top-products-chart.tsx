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
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Produtos Mais Movimentados
        </h2>

        <p className="text-sm text-slate-500">
          Top 5 movimentações
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="productName" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#2563EB"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}