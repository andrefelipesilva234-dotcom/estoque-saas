import { AppShell } from "@/components/app-shell";
import { inventoryAdjust } from "@/actions/inventory-adjust";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.role, "inventory")) {
    redirect("/dashboard");
  }

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Inventário
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Confira o estoque físico e corrija possíveis diferenças
            </p>
          </header>

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Produtos para conferência
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {products.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-blue-700">
                Objetivo
              </p>

              <p className="mt-2 text-sm font-semibold text-blue-700 sm:text-base">
                Manter o sistema igual ao estoque físico
              </p>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Conferência Física
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Informe a quantidade encontrada fisicamente e salve o ajuste.
              </p>
            </div>

            {products.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Nenhum produto cadastrado
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Cadastre produtos antes de realizar a conferência.
                </p>
              </div>
            ) : (
              <>
                {/* Versão celular */}
                <div className="divide-y divide-slate-200 md:hidden">
                  {products.map((product) => (
                    <article
                      key={product.id}
                      className="p-4"
                    >
                      <div className="mb-4">
                        <h3 className="font-semibold text-slate-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          SKU: {product.sku || "Não informado"}
                        </p>
                      </div>

                      <div className="mb-4 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Estoque no sistema
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {product.stock}
                        </p>
                      </div>

                      <form
                        action={inventoryAdjust}
                        className="space-y-3"
                      >
                        <input
                          type="hidden"
                          name="productId"
                          value={product.id}
                        />

                        <div>
                          <label
                            htmlFor={`physical-stock-mobile-${product.id}`}
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            Estoque físico
                          </label>

                          <input
                            id={`physical-stock-mobile-${product.id}`}
                            type="number"
                            name="physicalStock"
                            min="0"
                            defaultValue={product.stock}
                            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                          Ajustar estoque
                        </button>
                      </form>
                    </article>
                  ))}
                </div>

                {/* Versão computador */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Produto
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Estoque no sistema
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Estoque físico
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Ação
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className={
                            index % 2 === 0
                              ? "border-t border-slate-100 bg-white"
                              : "border-t border-slate-100 bg-slate-50/60"
                          }
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              SKU: {product.sku || "Não informado"}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-lg font-bold text-slate-900">
                              {product.stock}
                            </span>
                          </td>

                          <td
                            className="px-6 py-4"
                            colSpan={2}
                          >
                            <form
                              action={inventoryAdjust}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="hidden"
                                name="productId"
                                value={product.id}
                              />

                              <input
                                type="number"
                                name="physicalStock"
                                min="0"
                                defaultValue={product.stock}
                                className="w-36 rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                              />

                              <button
                                type="submit"
                                className="whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
                              >
                                Ajustar
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}