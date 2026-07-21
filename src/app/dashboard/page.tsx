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

function getDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date();

  const last30Days = Array.from(
    {
      length: 30,
    },
    (_, index) => {
      const date = new Date(today);

      date.setDate(
        today.getDate() - (29 - index)
      );

      return {
        date,
        label: date.toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
          }
        ),
      };
    }
  );

  const startDate =
    last30Days[0].date;

  const [
    products,
    movementCounts,
    topProductCounts,
    latestAudits,
    movements30Days,
  ] = await Promise.all([
    prisma.product.findMany({
      where: {
        companyId: user.companyId,
      },
      select: {
        id: true,
        name: true,
        stock: true,
        minimumStock: true,
      },
    }),

    prisma.stockMovement.groupBy({
      by: ["type"],
      where: {
        product: {
          companyId: user.companyId,
        },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.stockMovement.groupBy({
      by: ["productId"],
      where: {
        product: {
          companyId: user.companyId,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          productId: "desc",
        },
      },
      take: 5,
    }),

    prisma.auditLog.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        action: true,
        productName: true,
        oldStock: true,
        newStock: true,
        difference: true,
        createdAt: true,
      },
    }),

    prisma.stockMovement.findMany({
      where: {
        product: {
          companyId: user.companyId,
        },
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        type: true,
        createdAt: true,
      },
    }),
  ]);

  const totalProducts =
    products.length;

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <=
        product.minimumStock
    ).length;

  const healthyProducts =
    totalProducts -
    lowStockProducts;

  const stockHealth =
    totalProducts > 0
      ? Math.round(
          (healthyProducts /
            totalProducts) *
            100
        )
      : 100;

  const totalItems =
    products.reduce(
      (total, product) =>
        total + product.stock,
      0
    );

  function getMovementCount(
    acceptedTypes: string[]
  ) {
    return movementCounts.reduce(
      (total, movement) => {
        if (
          acceptedTypes.includes(
            movement.type
          )
        ) {
          return (
            total +
            movement._count._all
          );
        }

        return total;
      },
      0
    );
  }

  const totalPerdas =
    getMovementCount([
      "PERDA",
      "LOSS",
    ]);

  const totalEntradas =
    getMovementCount([
      "ENTRADA",
      "ENTRY",
    ]);

  const totalSaidas =
    getMovementCount([
      "SAIDA",
      "EXIT",
    ]);

  const produtosCriticos = [
    ...products,
  ]
    .sort(
      (firstProduct, secondProduct) =>
        firstProduct.stock -
        secondProduct.stock
    )
    .slice(0, 5);

  const productNameById =
    new Map(
      products.map((product) => [
        product.id,
        product.name,
      ])
    );

  const topProducts =
    topProductCounts.map(
      (product) => ({
        productId:
          product.productId,

        productName:
          productNameById.get(
            product.productId
          ) ||
          "Produto não encontrado",

        total:
          product._count._all,
      })
    );

  const chartDataByDate =
    new Map(
      last30Days.map((day) => [
        getDateKey(day.date),
        {
          date: day.label,
          entradas: 0,
          saidas: 0,
          perdas: 0,
        },
      ])
    );

  for (
    const movement of movements30Days
  ) {
    const dateKey =
      getDateKey(
        movement.createdAt
      );

    const chartDay =
      chartDataByDate.get(dateKey);

    if (!chartDay) {
      continue;
    }

    if (
      movement.type === "ENTRADA" ||
      movement.type === "ENTRY"
    ) {
      chartDay.entradas += 1;
      continue;
    }

    if (
      movement.type === "SAIDA" ||
      movement.type === "EXIT"
    ) {
      chartDay.saidas += 1;
      continue;
    }

    if (
      movement.type === "PERDA" ||
      movement.type === "LOSS"
    ) {
      chartDay.perdas += 1;
    }
  }

  const chartData =
    last30Days.map((day) => {
      const dateKey =
        getDateKey(day.date);

      return (
        chartDataByDate.get(
          dateKey
        ) || {
          date: day.label,
          entradas: 0,
          saidas: 0,
          perdas: 0,
        }
      );
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

            <Link
              href="/low-stock"
              className="block"
            >
              <KpiCard
                title="Alertas"
                value={
                  lowStockProducts
                }
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
                  : stockHealth <
                      95
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
              stockHealth={
                stockHealth
              }
              lowStockProducts={
                lowStockProducts
              }
              totalPerdas={
                totalPerdas
              }
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="min-w-0 xl:col-span-2">
                <MovementsChart
                  data={chartData}
                />
              </div>

              <AlertsCenter
                lowStockProducts={
                  lowStockProducts
                }
                totalPerdas={
                  totalPerdas
                }
              />
            </div>

            <TopProductsChart
              data={topProducts}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Produtos com Menor Estoque
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
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
                    {produtosCriticos.map(
                      (
                        product,
                        index
                      ) => (
                        <tr
                          key={
                            product.id
                          }
                          className={
                            index %
                              2 ===
                            0
                              ? "bg-white"
                              : "bg-slate-50"
                          }
                        >
                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {
                              product.name
                            }
                          </td>

                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {
                              product.stock
                            }
                          </td>

                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {
                              product.minimumStock
                            }
                          </td>
                        </tr>
                      )
                    )}

                    {produtosCriticos.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6"
                        >
                          Nenhum produto
                          cadastrado.
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
                <table className="w-full min-w-[900px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Ação
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Produto
                      </th>

                      <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-slate-500 sm:px-6 sm:py-4">
                        Estoque
                        Anterior
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
                    {latestAudits.map(
                      (
                        audit,
                        index
                      ) => (
                        <tr
                          key={
                            audit.id
                          }
                          className={
                            index %
                              2 ===
                            0
                              ? "bg-white"
                              : "bg-slate-50"
                          }
                        >
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                              {
                                audit.action
                              }
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {audit.productName ||
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {audit.oldStock ??
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {audit.newStock ??
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-sm font-semibold sm:px-6 sm:py-4">
                            {audit.difference ??
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                            {new Date(
                              audit.createdAt
                            ).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                        </tr>
                      )
                    )}

                    {latestAudits.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6"
                        >
                          Nenhuma auditoria
                          registrada.
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