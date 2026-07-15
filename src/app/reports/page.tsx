import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { requirePermission } from "@/lib/require-permission";

export default async function ReportsPage() {
const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (
    !hasPermission(
      user.role,
      "reports"
    )
  ) {
    redirect("/dashboard");
  }

  requirePermission(
    user.role,
    "reports"
  );

requirePermission(
  user.role,
  "reports"
);

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
(acc, product) => acc + product.stock,
0
);

const lowStockProducts = products.filter(
(product) =>
product.stock <= product.minimumStock
).length;

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">
        Relatórios
      </h1>

      <a
        href="/api/export/products"
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
      >
        ⬇️ Exportar CSV
      </a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-500">
          Total de Produtos
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {totalProducts}
        </h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-6">
        <p className="text-green-700">
          Itens em Estoque
        </p>

        <h2 className="text-4xl font-bold mt-2 text-green-600">
          {totalItems}
        </h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6">
        <p className="text-red-700">
          Estoque Baixo
        </p>

        <h2 className="text-4xl font-bold mt-2 text-red-600">
          {lowStockProducts}
        </h2>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">
          Estoque Atual
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">
              Produto
            </th>

            <th className="text-left p-4">
              Categoria
            </th>

            <th className="text-left p-4">
              Estoque
            </th>

            <th className="text-left p-4">
              Mínimo
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-4">
                {product.name}
              </td>

              <td className="p-4">
                {product.category}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">
                {product.minimumStock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">
          Últimas Movimentações
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">
              Produto
            </th>

            <th className="text-left p-4">
              Tipo
            </th>

            <th className="text-left p-4">
              Quantidade
            </th>

            <th className="text-left p-4">
              Data
            </th>
          </tr>
        </thead>

        <tbody>
          {movements.map((movement) => (
            <tr
              key={movement.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-4">
                {movement.product.name}
              </td>

              <td className="p-4">
                {movement.type}
              </td>

              <td className="p-4">
                {movement.quantity}
              </td>

              <td className="p-4">
                {new Date(
                  movement.createdAt
                ).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
</div>

);
}
