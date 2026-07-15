import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { requirePermission } from "@/lib/require-permission";

export default async function BillingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(
    user.role,
    "billing"
  );

  const company = await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
  });

  if (!company) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={user.role} />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Planos e Assinatura
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold">
            Plano Atual
          </h2>

          <p className="text-3xl font-bold text-blue-600 mt-3">
            {company.plan}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold">
              START
            </h2>

            <p className="text-4xl font-bold mt-3">
              R$19,90
            </p>

            <p className="text-gray-500 text-sm">
              por mês
            </p>

            <ul className="mt-4 space-y-2">
              <li>Até 100 produtos</li>
              <li>1 usuário</li>
              <li>Relatórios básicos</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold">
              PRO
            </h2>

            <p className="text-4xl font-bold mt-3">
              R$39,90
            </p>

            <p className="text-gray-500 text-sm">
              por mês
            </p>

            <ul className="mt-4 space-y-2">
              <li>Até 1.000 produtos</li>
              <li>5 usuários</li>
              <li>Exportação CSV</li>
              <li>Relatórios avançados</li>
            </ul>

            <a
              href="https://SEU-LINK-CAKTO-PRO"
              target="_blank"
              className="block mt-6 bg-blue-600 text-white text-center p-3 rounded-lg"
            >
              Assinar PRO
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
            <h2 className="text-2xl font-bold">
              BUSINESS
            </h2>

            <p className="text-4xl font-bold mt-3">
              R$49,90
            </p>

            <p className="text-gray-500 text-sm">
              por mês
            </p>

            <ul className="mt-4 space-y-2">
              <li>Produtos ilimitados</li>
              <li>Usuários ilimitados</li>
              <li>Suporte prioritário</li>
              <li>Todas as funcionalidades</li>
            </ul>

            <a
              href="https://SEU-LINK-CAKTO-BUSINESS"
              target="_blank"
              className="block mt-6 bg-green-600 text-white text-center p-3 rounded-lg"
            >
              Assinar BUSINESS
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}