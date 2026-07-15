import { Sidebar } from "@/components/sidebar";
import { getUser } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { requirePermission } from "@/lib/require-permission";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { createUser } from "@/actions/create-user";
import ToggleUserButton from "@/components/toggle-user-button";

export default async function UsersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(
    user.role,
    "users"
  );

  if (
    !hasPermission(
      user.role,
      "users"
    )
  ) {
    redirect("/dashboard");
  }

  const users =
    await prisma.user.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={user.role} />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Usuários
          </h1>

          <p className="text-slate-500 mt-2">
            Gerencie os usuários da empresa
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 max-w-4xl">
          <h2 className="text-xl font-semibold mb-6">
            Novo Usuário
          </h2>

          <form
            action={createUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              placeholder="Nome"
              className="border border-slate-300 p-3 rounded-xl"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="border border-slate-300 p-3 rounded-xl"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Senha"
              className="border border-slate-300 p-3 rounded-xl"
              required
            />

            <select
              name="role"
              className="border border-slate-300 p-3 rounded-xl"
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

            <button
              type="submit"
              className="
                bg-slate-900
                hover:bg-slate-800
                text-white
                rounded-xl
                px-4
                py-3
              "
            >
              Criar Usuário
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold">
              Usuários Cadastrados
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Nome
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    E-mail
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Cargo
                  </th>

                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
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
                        ? "bg-white"
                        : "bg-slate-50"
                    }
                  >
                    <td className="px-6 py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="px-6 py-4">
                      {item.email}
                    </td>

                    <td className="px-6 py-4">
                      {item.role}
                    </td>

                    <td className="px-6 py-4">
                      {item.active ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
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

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-slate-500"
                    >
                      Nenhum usuário cadastrado
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