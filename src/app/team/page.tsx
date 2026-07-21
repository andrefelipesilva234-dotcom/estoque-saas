import { AppShell } from "@/components/app-shell";
import { createUser } from "@/actions/create-user";
import { toggleUser } from "@/actions/toggle-user";
import { deleteUser } from "@/actions/delete-user";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.role, "team")) {
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
              Equipe
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Cadastre funcionários e gerencie os acessos da empresa
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:max-w-4xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Novo Funcionário
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Informe os dados de acesso e selecione o cargo do funcionário.
              </p>
            </div>

            <form
              action={createUser}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="team-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nome
                </label>

                <input
                  id="team-name"
                  name="name"
                  type="text"
                  placeholder="Nome do funcionário"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="team-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="team-email"
                  name="email"
                  type="email"
                  placeholder="funcionario@empresa.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="team-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Senha
                </label>

                <input
                  id="team-password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="team-role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Cargo
                </label>

                <select
                  id="team-role"
                  name="role"
                  defaultValue="OPERADOR"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ADMINISTRADOR">
                    Administrador
                  </option>

                  <option value="GERENTE">
                    Gerente
                  </option>

                  <option value="OPERADOR">
                    Operador
                  </option>

                  <option value="VISUALIZADOR">
                    Visualizador
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Adicionar Funcionário
                </button>
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Funcionários Cadastrados
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Ative, desative ou exclua os acessos da equipe.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {users.length} membro
                  {users.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Nenhum funcionário cadastrado
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Utilize o formulário acima para cadastrar o primeiro membro.
                </p>
              </div>
            ) : (
              <>
                {/* Versão para celular */}
                <div className="divide-y divide-slate-200 md:hidden">
                  {users.map((member) => (
                    <article
                      key={member.id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {member.name}
                          </h3>

                          <p className="mt-1 break-all text-sm text-slate-500">
                            {member.email}
                          </p>
                        </div>

                        {member.active ? (
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
                          {member.role}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <form
                          action={toggleUser}
                          className="w-full"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={member.id}
                          />

                          <button
                            type="submit"
                            className={
                              member.active
                                ? "w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-600"
                                : "w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700"
                            }
                          >
                            {member.active
                              ? "Desativar"
                              : "Ativar"}
                          </button>
                        </form>

                        {member.role !== "PROPRIETARIO" && (
                          <form
                            action={deleteUser}
                            className="w-full"
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={member.id}
                            />

                            <button
                              type="submit"
                              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                              Excluir
                            </button>
                          </form>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Versão para computador */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[900px]">
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
                      {users.map((member, index) => (
                        <tr
                          key={member.id}
                          className={
                            index % 2 === 0
                              ? "border-t border-slate-100 bg-white"
                              : "border-t border-slate-100 bg-slate-50/60"
                          }
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {member.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {member.email}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-700">
                            {member.role}
                          </td>

                          <td className="px-6 py-4">
                            {member.active ? (
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Inativo
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <form action={toggleUser}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={member.id}
                                />

                                <button
                                  type="submit"
                                  className={
                                    member.active
                                      ? "rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                                      : "rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                  }
                                >
                                  {member.active
                                    ? "Desativar"
                                    : "Ativar"}
                                </button>
                              </form>

                              {member.role !== "PROPRIETARIO" && (
                                <form action={deleteUser}>
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={member.id}
                                  />

                                  <button
                                    type="submit"
                                    className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                  >
                                    Excluir
                                  </button>
                                </form>
                              )}
                            </div>
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