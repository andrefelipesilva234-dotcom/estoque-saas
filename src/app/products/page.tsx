import ProductsSearchInput from "@/components/products-search-input";
import ProductSearch from "@/components/product-search";
import { AppShell } from "@/components/app-shell";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/actions/product";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }>;
}

export default async function ProductsPage({
  searchParams,
}: PageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.role, "products")) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const search = params.search || "";

  const currentPage = Math.max(
    1,
    Number(params.page || "1")
  );

  const sort = params.sort || "createdAt";
  const order = params.order || "desc";
  const pageSize = 10;

  const where = {
    companyId: user.companyId,

    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const totalProducts = await prisma.product.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / pageSize)
  );

  const products = await prisma.product.findMany({
    where,

    orderBy: {
      [sort]: order,
    },

    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const paginationParams =
    `search=${encodeURIComponent(search)}` +
    `&sort=${encodeURIComponent(sort)}` +
    `&order=${order}`;

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Produtos
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Total de produtos cadastrados:{" "}
              {totalProducts}
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:max-w-3xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
              Novo Produto
            </h2>

            <form
              action={createProduct}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                name="name"
                placeholder="Nome do produto"
                className="min-w-0 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <input
                name="sku"
                placeholder="SKU"
                className="min-w-0 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                name="category"
                placeholder="Categoria"
                className="min-w-0 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Estoque Inicial"
                className="min-w-0 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <input
                name="minimumStock"
                type="number"
                min="0"
                placeholder="Estoque Mínimo"
                className="min-w-0 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 md:col-span-2 md:w-auto md:justify-self-start"
              >
                Salvar Produto
              </button>
            </form>
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  Lista de Produtos
                </h2>

                <div className="w-full md:w-auto">
                  <ProductsSearchInput />
                </div>
              </div>

              <div className="min-w-0 overflow-x-auto">
                <ProductSearch products={products} />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {currentPage > 1 && (
                  <Link
                    href={`/products?${paginationParams}&page=${
                      currentPage - 1
                    }`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    ← Anterior
                  </Link>
                )}

                <span className="text-center text-sm font-semibold text-slate-700 sm:text-base">
                  Página {currentPage} de {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/products?${paginationParams}&page=${
                      currentPage + 1
                    }`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Próxima →
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}