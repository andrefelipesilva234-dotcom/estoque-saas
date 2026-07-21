import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  const product = await prisma.product.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!product) {
    redirect("/products");
  }

  const movements = await prisma.stockMovement.findMany({
    where: {
      productId: product.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalEntradas = movements
    .filter(
      (movement) =>
        movement.type === "ENTRADA" ||
        movement.type === "ENTRY"
    )
    .reduce(
      (total, movement) =>
        total + movement.quantity,
      0
    );

  const totalSaidas = movements
    .filter(
      (movement) =>
        movement.type === "SAIDA" ||
        movement.type === "EXIT"
    )
    .reduce(
      (total, movement) =>
        total + movement.quantity,
      0
    );

  const totalPerdas = movements
    .filter(
      (movement) =>
        movement.type === "PERDA" ||
        movement.type === "LOSS"
    )
    .reduce(
      (total, movement) =>
        total + movement.quantity,
      0
    );

  function getMovementLabel(type: string) {
    if (
      type === "ENTRADA" ||
      type === "ENTRY"
    ) {
      return "Entrada";
    }

    if (
      type === "SAIDA" ||
      type === "EXIT"
    ) {
      return "Saída";
    }

    if (
      type === "PERDA" ||
      type === "LOSS"
    ) {
      return "Perda";
    }

    return type;
  }

  function getMovementClass(type: string) {
    if (
      type === "ENTRADA" ||
      type === "ENTRY"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      type === "SAIDA" ||
      type === "EXIT"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      type === "PERDA" ||
      type === "LOSS"
    ) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <Link
              href="/products"
              className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Voltar para produtos
            </Link>

            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Histórico de Movimentações
            </h1>

            <p className="mt-2 break-words text-sm text-slate-500 sm:text-base">
              {product.name}
            </p>
          </header>

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Estoque atual
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {product.stock}
              </p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-green-700">
                Total de entradas
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {totalEntradas}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-red-700">
                Total de saídas
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {totalSaidas}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-amber-700">
                Total de perdas
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {totalPerdas}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Movimentações Registradas
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Histórico completo deste produto.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {movements.length} registro
                  {movements.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {movements.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Nenhuma movimentação encontrada
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  As futuras entradas, saídas e perdas aparecerão nesta página.
                </p>

                <Link
                  href={`/products/adjust/${product.id}`}
                  className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Registrar movimentação
                </Link>
              </div>
            ) : (
              <>
                {/* Versão para celular */}
                <div className="divide-y divide-slate-200 md:hidden">
                  {movements.map((movement) => (
                    <article
                      key={movement.id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMovementClass(
                            movement.type
                          )}`}
                        >
                          {getMovementLabel(
                            movement.type
                          )}
                        </span>

                        <span className="text-xs text-slate-500">
                          {new Date(
                            movement.createdAt
                          ).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Quantidade
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {movement.quantity}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Data e horário
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {new Date(
                            movement.createdAt
                          ).toLocaleString(
                            "pt-BR"
                          )}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Observação
                        </p>

                        <p className="mt-1 break-words text-sm text-slate-700">
                          {movement.observation ||
                            "Nenhuma observação"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Versão para computador */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Data
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Tipo
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Quantidade
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                              {new Date(
                                movement.createdAt
                              ).toLocaleString(
                                "pt-BR"
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMovementClass(
                                  movement.type
                                )}`}
                              >
                                {getMovementLabel(
                                  movement.type
                                )}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                              {movement.quantity}
                            </td>

                            <td className="max-w-md px-6 py-4 text-sm text-slate-600">
                              <span className="block truncate">
                                {movement.observation ||
                                  "-"}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="border-t border-slate-200 p-4 sm:p-6">
              <Link
                href={`/products/adjust/${product.id}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 sm:w-auto"
              >
                Nova movimentação
              </Link>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}