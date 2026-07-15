import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

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
(product) => product.stock <= product.minimumStock
);

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <h1 className="text-4xl font-bold mb-8 text-red-600">
      ⚠ Estoque Baixo
    </h1>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-red-50">
          <tr>
            <th className="text-left p-4">
              Produto
            </th>

            <th className="text-left p-4">
              SKU
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
                {product.sku}
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

      {lowStockProducts.length === 0 && (
        <div className="p-8 text-center text-green-600 font-bold">
          Nenhum produto com estoque baixo.
        </div>
      )}
    </div>
  </main>
</div>

);
}
