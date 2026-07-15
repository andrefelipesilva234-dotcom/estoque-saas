import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function MovementsPage({
  searchParams,
}: PageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  const currentPage = Number(
    params.page || "1"
  );

  const pageSize = 20;

  const total =
    await prisma.stockMovement.count({
      where: {
        product: {
          companyId:
            user.companyId,
        },
      },
    });

  const totalPages = Math.ceil(
    total / pageSize
  );

  const movements =
    await prisma.stockMovement.findMany({
      where: {
        product: {
          companyId:
            user.companyId,
        },
      },

      include: {
        product: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip:
        (currentPage - 1) *
        pageSize,

      take: pageSize,
    });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={user.role} />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-2">
          Movimentações
        </h1>

        <p className="text-slate-500 mb-8">
          Histórico completo de estoque
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-left">
                  Data
                </th>

                <th className="px-6 py-4 text-left">
                  Produto
                </th>

                <th className="px-6 py-4 text-left">
                  Tipo
                </th>

                <th className="px-6 py-4 text-left">
                  Quantidade
                </th>

                <th className="px-6 py-4 text-left">
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

                    <td className="px-6 py-4 font-medium">
                      {
                        movement.product
                          .name
                      }
                    </td>

                    <td className="px-6 py-4">

                      {movement.type ===
                      "ENTRADA" ? (
                        <span className="text-green-600 font-medium">
                          Entrada
                        </span>
                      ) : movement.type ===
                        "SAIDA" ? (
                        <span className="text-red-600 font-medium">
                          Saída
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium">
                          Perda
                        </span>
                      )}

                    </td>

                    <td className="px-6 py-4">
                      {
                        movement.quantity
                      }
                    </td>

                    <td className="px-6 py-4">
                      {movement.observation ||
                        "-"}
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