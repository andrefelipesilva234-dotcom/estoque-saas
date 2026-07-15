import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductHistoryPage({
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

  const movements =
    await prisma.stockMovement.findMany({
      where: {
        productId: product.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={user.role} />

      <main className="flex-1 p-8">
        <div className="max-w-6xl">

          <h1 className="text-4xl font-bold mb-2">
            Histórico de Movimentações
          </h1>

          <p className="text-slate-500 mb-8">
            {product.name}
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4">
                    Data
                  </th>

                  <th className="text-left px-6 py-4">
                    Tipo
                  </th>

                  <th className="text-left px-6 py-4">
                    Quantidade
                  </th>

                  <th className="text-left px-6 py-4">
                    Observação
                  </th>

                </tr>

              </thead>

              <tbody>

                {movements.map(
                  (movement) => (
                    <tr
                      key={movement.id}
                      className="border-t"
                    >
                      <td className="px-6 py-4">
                        {new Date(
                          movement.createdAt
                        ).toLocaleString(
                          "pt-BR"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {movement.type}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {movement.quantity}
                      </td>

                      <td className="px-6 py-4">
                        {movement.observation ||
                          "-"}
                      </td>
                    </tr>
                  )
                )}

                {movements.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-12 text-slate-500"
                    >
                      Nenhuma movimentação encontrada
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </main>
    </div>
  );
}