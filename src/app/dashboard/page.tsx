import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { AlertsCenter } from "@/components/dashboard/alerts-center";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MovementsChart } from "@/components/dashboard/movements-chart";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
  });

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minimumStock
  ).length;

  const healthyProducts = totalProducts - lowStockProducts;

  const stockHealth =
    totalProducts > 0
      ? Math.round((healthyProducts / totalProducts) * 100)
      : 100;

  const totalItems = products.reduce(
    (acc, product) => acc + product.stock,
    0
  );

  const totalPerdas = await prisma.stockMovement.count({
    where: {
      type: "PERDA",
      product: {
        companyId: user.companyId,
      },
    },
  });

  const totalEntradas = await prisma.stockMovement.count({
    where: {
      type: "ENTRADA",
      product: {
        companyId: user.companyId,
      },
    },
  });

  const totalSaidas = await prisma.stockMovement.count({
    where: {
      type: "SAIDA",
      product: {
        companyId: user.companyId,
      },
    },
  });

  const produtosCriticos = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      stock: "asc",
    },
    take: 5,
  });

  const movements = await prisma.stockMovement.findMany({
    where: {
      product: {
        companyId: user.companyId,
      },
    },
    include: {
      product: true,
    },
  });

  const topProductsMap = new Map<
    string,
    {
      productId: string;
      productName: string;
      total: number;
    }
  >();

  for (const movement of movements) {
    const current = topProductsMap.get(movement.productId) || {
      productId: movement.productId,
      productName: movement.product.name,
      total: 0,
    };

    current.total += 1;

    topProductsMap.set(movement.productId, current);
  }

  const topProducts = Array.from(topProductsMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const latestAudits = await prisma.auditLog.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const last30Days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() - (29 - index));

    return {
      date,
      label: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
    };
  });

  const movements30Days = await prisma.stockMovement.findMany({
    where: {
      product: {
        companyId: user.companyId,
      },
      createdAt: {
        gte: last30Days[0].date,
      },
    },
  });

  const chartData = last30Days.map((day) => {
    const sameDay = movements30Days.filter(
      (movement) =>
        movement.createdAt.toDateString() === day.date.toDateString()
    );

    return {
      date: day.label,
      entradas: sameDay.filter(
        (movement) => movement.type === "ENTRADA"
      ).length,
      saidas: sameDay.filter(
        (movement) => movement.type === "SAIDA"
      ).length,
      perdas: sameDay.filter(
        (movement) => movement.type === "PERDA"
      ).length,
    };
  });

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <div className="mb-6 md:mb-10">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Visão geral da operação
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            <KpiCard
              title="Total de Produtos"
              value={totalProducts}
            />

            <Link href="/low-stock" className="block">
              <KpiCard
                title="Alertas"
                value={lowStockProducts}
                description="Produtos abaixo do mínimo"
                variant={
                  lowStockProducts > 0
                    ? "danger"
                    : "default"
                }
              />
            </Link>

            <KpiCard
              title="Itens em Estoque"
              value={totalItems}
            />

            <KpiCard
              title="Perdas"
              value={totalPerdas}
              variant={
                totalPerdas > 0
                  ? "warning"
                  : "default"
              }
            />

            <KpiCard
              title="Entradas"
              value={totalEntradas}
            />

            <KpiCard
              title="Saídas"
              value={totalSaidas}
            />

            <KpiCard
              title="Saúde do Estoque"
              value={`${stockHealth}%`}
              description="Produtos dentro do nível ideal"
              variant={
                stockHealth < 80
                  ? "danger"
                  : stockHealth < 95
                    ? "warning"
                    : "default"
              }
            />

            <KpiCard
              title="Plano"
              value="START"
            />
          </div>

          <div className="mb-8 space-y-6">
            <ExecutiveSummary
              stockHealth={stockHealth}
              lowStockProducts={lowStockProducts}
              totalPerdas={totalPerdas}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="min-w-0 xl:col-span-2">
                <MovementsChart data={chartData} />
              </div>

              <AlertsCenter
                lowStockProducts={lowStockProducts}
                totalPerdas={totalPerdas}
              />
            </div>

            <TopProductsChart data={topProducts} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Produtos com Menor Estoque
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[560px] w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Produto
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Estoque
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Mínimo
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {produtosCriticos.map((product, index) => (
                      <tr
                        key={product.id}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50"
                        }
                      >
                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {product.name}
                        </td>

                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {product.stock}
                        </td>

                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {product.minimumStock}
                        </td>
                      </tr>
                    ))}

                    {produtosCriticos.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6"
                        >
                          Nenhum produto cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Últimas Auditorias
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Ação
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Produto
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Estoque Anterior
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Estoque Novo
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Diferença
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Data
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestAudits.map((audit, index) => (
                      <tr
                        key={audit.id}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50"
                        }
                      >
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            {audit.action}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {audit.productName || "-"}
                        </td>

                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {audit.oldStock ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {audit.newStock ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-sm font-semibold sm:px-6 sm:py-4">
                          {audit.difference ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                          {new Date(
                            audit.createdAt
                          ).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}

                    {latestAudits.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6"
                        >
                          Nenhuma auditoria registrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}