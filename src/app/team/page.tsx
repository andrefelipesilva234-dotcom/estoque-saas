import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { createUser } from "@/actions/create-user";
import { toggleUser } from "@/actions/toggle-user";
import { deleteUser } from "@/actions/delete-user";

export default async function TeamPage() {
const user = await getUser();

if (!user) {
redirect("/login");
}

if (
  !hasPermission(
    user.role,
    "team"
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

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <h1 className="text-4xl font-bold mb-8">
      Equipe
    </h1>

    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-4xl">
      <h2 className="text-xl font-bold mb-4">
        Novo Funcionário
      </h2>

      <form
        action={createUser}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          placeholder="Nome"
          className="border p-3 rounded-lg"
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Senha"
          className="border p-3 rounded-lg"
          required
        />

        <select
          name="role"
          className="border p-3 rounded-lg"
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

        <button
          type="submit"
          className="bg-slate-900 text-white rounded-lg px-4 py-3"
        >
          Adicionar Funcionário
        </button>
      </form>
    </div>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          Usuários
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">
              Nome
            </th>

            <th className="text-left p-4">
              Email
            </th>

            <th className="text-left p-4">
              Cargo
            </th>

            <th className="text-left p-4">
              Status
            </th>

            <th className="text-left p-4">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((member) => (
            <tr
              key={member.id}
              className="border-t"
            >
              <td className="p-4">
                {member.name}
              </td>

              <td className="p-4">
                {member.email}
              </td>

              <td className="p-4">
                {member.role}
              </td>

              <td className="p-4">
                {member.active ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Ativo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Inativo
                  </span>
                )}
              </td>

              <td className="p-4">
                <div className="flex gap-2">
                  <form action={toggleUser}>
                    <input
                      type="hidden"
                      name="id"
                      value={member.id}
                    />

                    <button
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
                    >
                      {member.active
                        ? "Desativar"
                        : "Ativar"}
                    </button>
                  </form>

                  {member.role !==
                    "PROPRIETARIO" && (
                    <form
                      action={deleteUser}
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={member.id}
                      />

                      <button
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
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
  </main>
</div>

);
}
