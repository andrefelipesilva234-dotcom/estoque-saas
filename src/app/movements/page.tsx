import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  const currentPage = Math.max(
    1,
    Number(params.page || "1")
  );

  const pageSize = 20;

  const total = await prisma.stockMovement.count({
    where: {
      product: {
        companyId: user.companyId,
      },
    },
  });

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const movements =
    await prisma.stockMovement.findMany({
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

      skip:
        (safeCurrentPage - 1) *
        pageSize,

      take: pageSize,
    });

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Movimentações
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Histórico completo de estoque
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Total de movimentações: {total}
            </p>
          </header>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Data
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Produto
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Tipo
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Quantidade
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                      Observação
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {movements.map(
                    (movement, index) => (
                      <tr
                        key={movement.id}
                        className={
                          index % 2 === 0
                            ? "border-t border-slate-100 bg-white"
                            : "border-t border-slate-100 bg-slate-50/60"
                        }
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {new Date(
                            movement.createdAt
                          ).toLocaleString(
                            "pt-BR"
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                          {movement.product.name}
                        </td>

                        <td className="px-4 py-4 sm:px-6">
                          {movement.type ===
                          "ENTRADA" ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Entrada
                            </span>
                          ) : movement.type ===
                            "SAIDA" ? (
                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Saída
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              Perda
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-slate-700 sm:px-6">
                          {movement.quantity}
                        </td>

                        <td className="max-w-xs px-4 py-4 text-sm text-slate-600 sm:px-6">
                          <span className="block truncate">
                            {movement.observation ||
                              "-"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}

                  {movements.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-sm text-slate-500 sm:px-6"
                      >
                        Nenhuma movimentação registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 px-4 py-5 sm:px-6">
                {safeCurrentPage > 1 && (
                  <Link
                    href={`/movements?page=${
                      safeCurrentPage - 1
                    }`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    ← Anterior
                  </Link>
                )}

                <span className="text-center text-sm font-semibold text-slate-700">
                  Página {safeCurrentPage} de{" "}
                  {totalPages}
                </span>

                {safeCurrentPage <
                  totalPages && (
                  <Link
                    href={`/movements?page=${
                      safeCurrentPage + 1
                    }`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Próxima →
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}