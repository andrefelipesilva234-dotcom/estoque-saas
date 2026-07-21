import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { requirePermission } from "@/lib/require-permission";
import { redirect } from "next/navigation";

export default async function AuditPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(user.role, "audit");

  const logs = await prisma.auditLog.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Auditoria do Sistema
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Acompanhe todas as alterações críticas realizadas no estoque
            </p>
          </header>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total de registros
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {logs.length}
            </p>
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Histórico de Alterações
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Todas as alterações críticas ficam registradas aqui.
              </p>
            </div>

            {logs.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <span
                    className="text-2xl text-slate-500"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Nenhum registro encontrado
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  As futuras alterações críticas aparecerão nesta página.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Produto
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Ação
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Estoque anterior
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Estoque novo
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Diferença
                      </th>

                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                        Data
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={
                          index % 2 === 0
                            ? "border-t border-slate-100 bg-white"
                            : "border-t border-slate-100 bg-slate-50/60"
                        }
                      >
                        <td className="px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                          {log.productName || "-"}
                        </td>

                        <td className="px-4 py-4 sm:px-6">
                          <span className="inline-flex whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {log.action}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {log.oldStock ?? "-"}
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold text-slate-900 sm:px-6">
                          {log.newStock ?? "-"}
                        </td>

                        <td className="px-4 py-4 sm:px-6">
                          {typeof log.difference === "number" ? (
                            <span
                              className={
                                log.difference > 0
                                  ? "font-semibold text-green-600"
                                  : log.difference < 0
                                    ? "font-semibold text-red-600"
                                    : "font-semibold text-slate-600"
                              }
                            >
                              {log.difference > 0 ? "+" : ""}
                              {log.difference}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {new Date(
                            log.createdAt
                          ).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}