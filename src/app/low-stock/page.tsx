import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LowStockPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      stock: "asc",
    },
  });

  const lowStockProducts = products.filter(
    (product) =>
      product.stock <= product.minimumStock
  );

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-red-600 md:text-4xl">
              Estoque Baixo
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Produtos que atingiram ou ficaram abaixo do estoque mínimo
            </p>
          </header>

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Total de produtos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {products.length}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-red-700">
                Produtos com estoque baixo
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {lowStockProducts.length}
              </p>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Produtos que precisam de reposição
              </h2>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <span
                    className="text-2xl font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-green-600 sm:text-xl">
                  Estoque em situação normal
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 sm:text-base">
                  Nenhum produto está abaixo do estoque mínimo.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px]">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-700 sm:px-6">
                        Produto
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-700 sm:px-6">
                        SKU
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-700 sm:px-6">
                        Categoria
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-700 sm:px-6">
                        Estoque atual
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-700 sm:px-6">
                        Estoque mínimo
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-red-700 sm:px-6">
                        Reposição necessária
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {lowStockProducts.map(
                      (product, index) => {
                        const missingQuantity = Math.max(
                          product.minimumStock - product.stock,
                          0
                        );

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
                              {product.sku || "-"}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                              {product.category || "-"}
                            </td>

                            <td className="px-4 py-4 text-sm font-bold text-red-600 sm:px-6">
                              {product.stock}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700 sm:px-6">
                              {product.minimumStock}
                            </td>

                            <td className="px-4 py-4 sm:px-6">
                              {missingQuantity > 0 ? (
                                <span className="inline-flex whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                  Repor {missingQuantity} item
                                  {missingQuantity === 1 ? "" : "s"}
                                </span>
                              ) : (
                                <span className="inline-flex whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                  No limite mínimo
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}