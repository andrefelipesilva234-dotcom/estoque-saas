import { AppShell } from "@/components/app-shell";
import ToggleUserButton from "@/components/toggle-user-button";
import { createUser } from "@/actions/create-user";
import { getUser } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { requirePermission } from "@/lib/require-permission";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(user.role, "users");

  if (!hasPermission(user.role, "users")) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
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
              Usuários
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Gerencie os usuários da empresa
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:max-w-4xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Novo Usuário
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Cadastre um novo acesso e defina o nível de permissão.
              </p>
            </div>

            <form
              action={createUser}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="user-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nome
                </label>

                <input
                  id="user-name"
                  name="name"
                  type="text"
                  placeholder="Nome do usuário"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="user-email"
                  name="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="user-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Senha
                </label>

                <input
                  id="user-password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="user-role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Cargo
                </label>

                <select
                  id="user-role"
                  name="role"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  defaultValue="OPERADOR"
                >
                  <option value="PROPRIETARIO">
                    Proprietário
                  </option>

                  <option value="GERENTE">
                    Gerente
                  </option>

                  <option value="OPERADOR">
                    Operador
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Usuários Cadastrados
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Controle os acessos ativos da empresa.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {users.length} usuário
                  {users.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Nenhum usuário cadastrado
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Cadastre o primeiro usuário utilizando o formulário acima.
                </p>
              </div>
            ) : (
              <>
                {/* Versão celular */}
                <div className="divide-y divide-slate-200 md:hidden">
                  {users.map((item) => (
                    <article
                      key={item.id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 break-all text-sm text-slate-500">
                            {item.email}
                          </p>
                        </div>

                        {item.active ? (
                          <span className="inline-flex shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Inativo
                          </span>
                        )}
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Cargo
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.role}
                        </p>
                      </div>

                      <div className="mt-4">
                        <ToggleUserButton
                          userId={item.id}
                          active={item.active}
                        />
                      </div>
                    </article>
                  ))}
                </div>

                {/* Versão computador */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Nome
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          E-mail
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Cargo
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((item, index) => (
                        <tr
                          key={item.id}
                          className={
                            index % 2 === 0
                              ? "border-t border-slate-100 bg-white"
                              : "border-t border-slate-100 bg-slate-50/60"
                          }
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {item.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {item.email}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-700">
                            {item.role}
                          </td>

                          <td className="px-6 py-4">
                            {item.active ? (
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Inativo
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <ToggleUserButton
                              userId={item.id}
                              active={item.active}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}