import { AppShell } from "@/components/app-shell";
import { updateProduct } from "@/actions/update-product";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
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

  const updateAction = updateProduct.bind(
    null,
    product.id
  );

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
              Editar Produto
            </h1>

            <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">
              Atualize as informações de {product.name}
            </p>
          </header>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Dados do produto
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                O estoque atual não é alterado nesta tela.
              </p>
            </div>

            <form
              action={updateAction}
              className="grid grid-cols-1 gap-5 p-4 sm:p-6 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label
                  htmlFor="product-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nome do produto
                </label>

                <input
                  id="product-name"
                  name="name"
                  type="text"
                  defaultValue={product.name}
                  placeholder="Nome do produto"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="product-sku"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  SKU
                </label>

                <input
                  id="product-sku"
                  name="sku"
                  type="text"
                  defaultValue={product.sku || ""}
                  placeholder="Código do produto"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="product-category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Categoria
                </label>

                <input
                  id="product-category"
                  name="category"
                  type="text"
                  defaultValue={product.category || ""}
                  placeholder="Categoria do produto"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="minimum-stock"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Estoque mínimo
                </label>

                <input
                  id="minimum-stock"
                  name="minimumStock"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  defaultValue={product.minimumStock}
                  placeholder="Estoque mínimo"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estoque atual
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {product.stock}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Use a tela de ajuste para alterar esta quantidade.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 md:col-span-2 sm:flex-row sm:justify-end">
                <Link
                  href="/products"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </AppShell>
  );
}