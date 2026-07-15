import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { inventoryAdjust } from "@/actions/inventory-adjust";

export default async function InventoryPage() {
const user = await getUser();

if (!user) {
redirect("/login");
}

if (
!hasPermission(
user.role,
"inventory"
)
) {
redirect("/dashboard");
}

const products =
await prisma.product.findMany({
where: {
companyId:
user.companyId,
},
orderBy: {
name: "asc",
},
});

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <h1 className="text-4xl font-bold mb-8">
      Inventário
    </h1>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          Conferência Física
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">
              Produto
            </th>

            <th className="text-left p-4">
              Sistema
            </th>

            <th className="text-left p-4">
              Estoque Físico
            </th>

            <th className="text-left p-4">
              Ajustar
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map(
            (product) => (
              <tr
                key={product.id}
                className="border-t"
              >
                <td className="p-4 font-medium">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  <form
                    action={
                      inventoryAdjust
                    }
                    className="flex gap-3 items-center"
                  >
                    <input
                      type="hidden"
                      name="productId"
                      value={
                        product.id
                      }
                    />

                    <input
                      type="number"
                      name="physicalStock"
                      defaultValue={
                        product.stock
                      }
                      className="border rounded-lg p-2 w-32"
                    />

                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Ajustar
                    </button>
                  </form>
                </td>

                <td className="p-4 text-gray-500">
                  Corrigir estoque
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  </main>
</div>

);
}
