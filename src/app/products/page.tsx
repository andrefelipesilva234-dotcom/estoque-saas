import ProductsSearchInput from "@/components/products-search-input";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/actions/product";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import ProductSearch from "@/components/product-search";
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

  if (
    !hasPermission(
      user.role,
      "products"
    )
  ) {
    redirect("/dashboard");
  }

  const params =
    await searchParams;

  const search =
    params.search || "";

  const currentPage =
    Number(
      params.page || "1"
    );

  const sort =
    params.sort || "createdAt";

  const order =
    params.order || "desc";

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

  const totalProducts =
    await prisma.product.count({
      where,
    });

  const totalPages =
    Math.ceil(
      totalProducts /
        pageSize
    );

  const products =
    await prisma.product.findMany({
      where,

      orderBy: {
        [sort]: order,
      },

      skip:
        (currentPage - 1) *
        pageSize,

      take: pageSize,
  });

return ( <div className="flex min-h-screen bg-slate-50"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Produtos
        </h1>

        <p className="text-slate-500 mt-2">
          Total de produtos cadastrados:
          {" "}
          {totalProducts}
        </p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">
        Novo Produto
      </h2>

      <form
        action={createProduct}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          placeholder="Nome do produto"
          className="border border-slate-300 p-3 rounded-xl"
          required
        />

        <input
          name="sku"
          placeholder="SKU"
          className="border border-slate-300 p-3 rounded-xl"
        />

        <input
          name="category"
          placeholder="Categoria"
          className="border border-slate-300 p-3 rounded-xl"
        />

        <input
          name="stock"
          type="number"
          placeholder="Estoque Inicial"
          className="border border-slate-300 p-3 rounded-xl"
          required
        />

        <input
          name="minimumStock"
          type="number"
          placeholder="Estoque Mínimo"
          className="border border-slate-300 p-3 rounded-xl"
          required
        />

        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-3"
        >
          Salvar Produto
        </button>
      </form>
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h2 className="text-xl font-semibold">
          Lista de Produtos
        </h2>

<ProductsSearchInput />

      </div>

      <ProductSearch
        products={products}
      />

      <div className="flex justify-center items-center gap-3 mt-8">

        {currentPage > 1 && (
          <Link
            href={`/products?search=${search}&page=${currentPage - 1}`}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl"
          >
            ← Anterior
          </Link>
        )}

        <span className="font-semibold text-slate-700">
          Página {currentPage} de {totalPages}
        </span>

        {currentPage <
          totalPages && (
          <Link
            href={`/products?search=${search}&page=${currentPage + 1}`}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl"
          >
            Próxima →
          </Link>
        )}

      </div>
    </div>
  </main>
</div>

);
}
