import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { adjustStock } from "@/actions/stock";


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

  const product =
    await prisma.product.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

  if (!product) {
    redirect("/products");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={user.role} />

      <main className="flex-1 p-8">
        <div className="max-w-4xl">

          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Ajuste de Estoque
          </h1>

          <p className="text-slate-500 mb-8">
            Movimentar produto
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <h2 className="text-xl font-semibold mb-6">
              Informações do Produto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-slate-500">
                  Produto
                </p>

                <p className="font-semibold">
                  {product.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  SKU
                </p>

                <p className="font-semibold">
                  {product.sku || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Categoria
                </p>

                <p className="font-semibold">
                  {product.category || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Estoque Atual
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {product.stock}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Estoque Mínimo
                </p>

                <p className="font-semibold">
                  {product.minimumStock}
                </p>
              </div>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <h2 className="text-xl font-semibold mb-6">
              Nova Movimentação
            </h2>

            <form
              action={adjustStock}
              className="space-y-5"
            >
              <input
                type="hidden"
                name="productId"
                value={product.id}
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Movimentação
                </label>

                <select
                  name="type"
                  className="w-full border border-slate-300 rounded-xl p-3"
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
                <label className="block text-sm font-medium mb-2">
                  Quantidade
                </label>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  className="w-full border border-slate-300 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Observação
                </label>

                <textarea
                  name="observation"
                  rows={4}
                  className="w-full border border-slate-300 rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                className="
                  bg-slate-900
                  hover:bg-slate-800
                  text-white
                  px-6
                  py-3
                  rounded-xl
                "
              >
                Confirmar Movimentação
              </button>

            </form>

          </div>

        </div>
      </main>
    </div>
  );
}