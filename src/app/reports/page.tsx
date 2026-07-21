import { AppShell } from "@/components/app-shell";
import { hasPermission } from "@/lib/permissions";
import { requirePermission } from "@/lib/require-permission";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.role, "reports")) {
    redirect("/dashboard");
  }

  requirePermission(user.role, "reports");

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      name: "asc",
    },
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
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  const totalProducts = products.length;

  const totalItems = products.reduce(
    (accumulator, product) =>
      accumulator + product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.stock <= product.minimumStock
  ).length;

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Relatórios
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Visão geral dos produtos e movimentações
              </p>
            </div>

            <a
              href="/api/export/products"
              className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 sm:w-auto"
            >
              Exportar CSV
            </a>
          </header>

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Total de Produtos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                {totalProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-green-700">
                Itens em Estoque
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">
                {totalItems}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-red-700">
                Estoque Baixo
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600 sm:text-4xl">
                {lowStockProducts}
              </p>
            </div>
          </section>

          <section className="mb-8 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                Estoque Atual
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Produto
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Categoria
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Estoque
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Mínimo
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Situação
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product, index) => {
                    const isLowStock =
                      product.stock <=
                      product.minimumStock;

                    return (
                      <tr
                        key={product.id}
                        className={
                          index % 2 === 0
                            ? "border-t border-slate-100 bg-white"
                            : "border-t border-slate-100 bg-slate-50/60"
                        }
                      >
                        <td className="px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                          {product.name}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {product.category || "-"}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-slate-700 sm:px-6">
                          {product.stock}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {product.minimumStock}
                        </td>

                        <td className="px-4 py-4 sm:px-6">
                          {isLowStock ? (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Estoque baixo
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6"
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
              <h2 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                Últimas Movimentações
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Produto
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Tipo
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Quantidade
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Data
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {movements.map((movement, index) => (
                    <tr
                      key={movement.id}
                      className={
                        index % 2 === 0
                          ? "border-t border-slate-100 bg-white"
                          : "border-t border-slate-100 bg-slate-50/60"
                      }
                    >
                      <td className="px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                        {movement.product.name}
                      </td>

                      <td className="px-4 py-4 sm:px-6">
                        {movement.type ===
                        "ENTRADA" ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Entrada
                          </span>
                        ) : movement.type ===
                          "SAIDA" ? (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Saída
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Perda
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-700 sm:px-6">
                        {movement.quantity}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                        {new Date(
                          movement.createdAt
                        ).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                    </tr>
                  ))}

                  {movements.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6"
                      >
                        Nenhuma movimentação registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}