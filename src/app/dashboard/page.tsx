import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { AlertsCenter } from "@/components/dashboard/alerts-center";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { Sidebar } from "@/components/sidebar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MovementsChart } from "@/components/dashboard/movements-chart";
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
(product) =>
product.stock <= product.minimumStock
).length;

const healthyProducts =
totalProducts - lowStockProducts;

const stockHealth =
totalProducts > 0
? Math.round(
(healthyProducts /
totalProducts) *
100
)
: 100;

const totalItems = products.reduce(
(acc, product) =>
acc + product.stock,
0
);

const totalPerdas =
await prisma.stockMovement.count({
where: {
type: "PERDA",
product: {
companyId: user.companyId,
},
},
});

const totalEntradas =
await prisma.stockMovement.count({
where: {
type: "ENTRADA",
product: {
companyId: user.companyId,
},
},
});

const totalSaidas =
await prisma.stockMovement.count({
where: {
type: "SAIDA",
product: {
companyId: user.companyId,
},
},
});

const produtosCriticos =
await prisma.product.findMany({
where: {
companyId: user.companyId,
},
orderBy: {
stock: "asc",
},
take: 5,
});

const latestMovements =
await prisma.stockMovement.findMany({
where: {
product: {
companyId: user.companyId,
},
},
include: {
product: true,
},
orderBy: {
createdAt: "desc",
},
take: 5,
});

const movements =
await prisma.stockMovement.findMany({
where: {
product: {
companyId: user.companyId,
},
},
include: {
product: true,
},
});

const topProductsMap =
new Map();

for (const movement of movements) {
  const current =
    topProductsMap.get(
      movement.productId
    ) || {
      productId:
        movement.productId,
      productName:
        movement.product.name,
      total: 0,
    };

  current.total += 1;

  topProductsMap.set(
    movement.productId,
    current
  );
}

const topProducts =
  Array.from(
    topProductsMap.values()
  )
    .sort(
      (a, b) =>
        b.total - a.total
    )
    .slice(0, 5);

const latestAudits =
  await prisma.auditLog.findMany({
    where: {
      companyId: user.companyId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 5,
  });

const last30Days = Array.from(
{ length: 30 },
(_, i) => {
const date = new Date();


  date.setDate(
    date.getDate() -
      (29 - i)
  );

  return {
    date,
    label:
      date.toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
        }
      ),
  };
}


);

const movements30Days =
await prisma.stockMovement.findMany({
where: {
product: {
companyId:
user.companyId,
},
createdAt: {
gte: last30Days[0].date,
},
},
});

const chartData =
last30Days.map((day) => {
const sameDay =
movements30Days.filter(
(movement) =>
movement.createdAt.toDateString() ===
day.date.toDateString()
);

  return {
    date: day.label,

    entradas:
      sameDay.filter(
        (m) =>
          m.type ===
          "ENTRADA"
      ).length,

    saidas:
      sameDay.filter(
        (m) =>
          m.type ===
          "SAIDA"
      ).length,

    perdas:
      sameDay.filter(
        (m) =>
          m.type ===
          "PERDA"
      ).length,
  };
});


return ( <div className="flex min-h-screen bg-slate-50"> <Sidebar role={user.role} />


  <main className="flex-1">
    <div className="max-w-7xl mx-auto px-8 py-8">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Visão geral da operação
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <KpiCard
          title="Total de Produtos"
          value={totalProducts}
        />

        <Link href="/low-stock">
          <div>
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
          </div>
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

      <div className="space-y-6 mb-8">

  <ExecutiveSummary
    stockHealth={stockHealth}
    lowStockProducts={lowStockProducts}
    totalPerdas={totalPerdas}
  />

  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

    <div className="xl:col-span-2">
      <MovementsChart
        data={chartData}
      />
    </div>

    <AlertsCenter
      lowStockProducts={lowStockProducts}
      totalPerdas={totalPerdas}
    />

  </div>

  <TopProductsChart
    data={topProducts}
  />

</div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              Produtos com Menor Estoque
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                  Produto
                </th>

                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                  Estoque
                </th>

                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                  Mínimo
                </th>
              </tr>
            </thead>

            <tbody>
              {produtosCriticos.map(
                (product, index) => (
                  <tr
                    key={product.id}
                    className={
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50"
                    }
                  >
                    <td className="px-6 py-4">
                      {product.name}
                    </td>

                    <td className="px-6 py-4">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4">
                      {product.minimumStock}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>


        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

  <div className="px-6 py-5 border-b border-slate-200">
    <h2 className="text-xl font-semibold text-slate-900">
      Últimas Auditorias
    </h2>
  </div>

  <table className="w-full">
    <thead className="bg-slate-50">
      <tr>
        <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
          Ação
        </th>

        <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
          Produto
        </th>

        <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
          Estoque Anterior
        </th>

        <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
          Estoque Novo
        </th>

        <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
          Diferença
        </th>

        <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
          Data
        </th>
      </tr>
    </thead>

    <tbody>
      {latestAudits.map(
        (audit, index) => (
          <tr
            key={audit.id}
            className={
              index % 2 === 0
                ? "bg-white"
                : "bg-slate-50"
            }
          >
            <td className="px-6 py-4">
              <span
                className="
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  bg-blue-100
                  text-blue-700
                "
              >
                {audit.action}
              </span>
            </td>

            <td className="px-6 py-4">
              {audit.productName || "-"}
            </td>

            <td className="px-6 py-4">
              {audit.oldStock ?? "-"}
            </td>

            <td className="px-6 py-4">
              {audit.newStock ?? "-"}
            </td>

            <td className="px-6 py-4 font-semibold">
              {audit.difference ?? "-"}
            </td>

            <td className="px-6 py-4">
              {new Date(
                audit.createdAt
              ).toLocaleDateString(
                "pt-BR"
              )}
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>

</div>

      </div>

    </div>
  </main>
</div>


);
}
