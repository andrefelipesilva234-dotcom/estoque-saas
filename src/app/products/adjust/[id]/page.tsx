import { AppShell } from "@/components/app-shell";
import { adjustStock } from "@/actions/stock";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdjustProductPage({
  params,
}: PageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!product) {
    redirect("/products");
  }

  const isLowStock =
    product.stock <= product.minimumStock;

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <Link
              href="/products"
              className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Voltar para produtos
            </Link>

            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Ajuste de Estoque
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Registre uma entrada ou saída para este produto
            </p>
          </header>

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Informações do Produto
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Produto
                </p>

                <p className="mt-1 break-words font-semibold text-slate-900">
                  {product.name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  SKU
                </p>

                <p className="mt-1 break-words font-semibold text-slate-900">
                  {product.sku || "Não informado"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Categoria
                </p>

                <p className="mt-1 break-words font-semibold text-slate-900">
                  {product.category || "Não informada"}
                </p>
              </div>

              <div
                className={
                  isLowStock
                    ? "rounded-xl border border-red-200 bg-red-50 p-4"
                    : "rounded-xl border border-green-200 bg-green-50 p-4"
                }
              >
                <p
                  className={
                    isLowStock
                      ? "text-xs font-medium uppercase tracking-wide text-red-700"
                      : "text-xs font-medium uppercase tracking-wide text-green-700"
                  }
                >
                  Estoque Atual
                </p>

                <p
                  className={
                    isLowStock
                      ? "mt-1 text-3xl font-bold text-red-600"
                      : "mt-1 text-3xl font-bold text-green-600"
                  }
                >
                  {product.stock}
                </p>

                <p
                  className={
                    isLowStock
                      ? "mt-1 text-xs font-medium text-red-700"
                      : "mt-1 text-xs font-medium text-green-700"
                  }
                >
                  {isLowStock
                    ? "Produto em nível de alerta"
                    : "Estoque em nível normal"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estoque Mínimo
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {product.minimumStock}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Nova Movimentação
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A quantidade informada será aplicada ao estoque atual.
              </p>
            </div>

            <form
              action={adjustStock}
              className="space-y-5 p-4 sm:p-6"
            >
              <input
                type="hidden"
                name="productId"
                value={product.id}
              />

              <div>
                <label
                  htmlFor="movement-type"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Tipo de Movimentação
                </label>

                <select
                  id="movement-type"
                  name="type"
                  defaultValue="ENTRY"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="ENTRY">
                    Entrada
                  </option>

                  <option value="EXIT">
                    Saída
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="movement-quantity"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Quantidade
                </label>

                <input
                  id="movement-quantity"
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="Digite a quantidade"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="movement-observation"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Observação
                </label>

                <textarea
                  id="movement-observation"
                  name="observation"
                  rows={4}
                  placeholder="Descreva o motivo da movimentação"
                  className="w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <Link
                  href="/products"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
                >
                  Confirmar Movimentação
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </AppShell>
  );
}