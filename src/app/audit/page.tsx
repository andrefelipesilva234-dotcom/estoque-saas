import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { requirePermission } from "@/lib/require-permission";

export default async function AuditPage() {
const user = await getUser();

if (!user) {
redirect("/login");
}

requirePermission(
  user.role,
  "audit"
);

const logs = await prisma.auditLog.findMany({
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
      Auditoria do Sistema
    </h1>

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          Histórico de Alterações
        </h2>

        <p className="text-gray-500 mt-2">
          Todas as alterações críticas ficam registradas aqui.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          Nenhum registro encontrado.
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Produto
              </th>

              <th className="text-left p-4">
                Ação
              </th>

              <th className="text-left p-4">
                Estoque Anterior
              </th>

              <th className="text-left p-4">
                Estoque Novo
              </th>

              <th className="text-left p-4">
                Diferença
              </th>

              <th className="text-left p-4">
                Data
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  {log.productName}
                </td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {log.action}
                  </span>
                </td>

                <td className="p-4">
                  {log.oldStock}
                </td>

                <td className="p-4">
                  {log.newStock}
                </td>

                <td className="p-4">
                  {log.difference}
                </td>

                <td className="p-4">
                  {new Date(
                    log.createdAt
                  ).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </main>
</div>

);
}
