import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function AlertsPage() {
const user = await getUser();

if (!user) {
redirect("/login");
}

const products = await prisma.product.findMany({
where: {
companyId: user.companyId,
},
});

const lowStockProducts = products.filter(
(product) =>
product.stock <= product.minimumStock
);

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <h1 className="text-4xl font-bold mb-8">
      Alertas de Estoque
    </h1>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          Produtos Abaixo do Estoque Mínimo
        </h2>
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="p-12 text-center">
          <h3 className="text-xl font-bold text-green-600">
            Tudo certo!
          </h3>

          <p className="text-gray-500 mt-2">
            Nenhum produto está abaixo do estoque mínimo.
          </p>
        </div>
      ) : (
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
                Estoque Atual
              </th>

              <th className="text-left p-4">
                Estoque Mínimo
              </th>
            </tr>
          </thead>

          <tbody>
            {lowStockProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t"
              >
                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4 text-red-600 font-bold">
                  {product.stock}
                </td>

                <td className="p-4">
                  {product.minimumStock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </main>
</div>

);
}
