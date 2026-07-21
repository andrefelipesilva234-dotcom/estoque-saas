import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { requirePermission } from "@/lib/require-permission";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(user.role, "billing");

  const company = await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
  });

  if (!company) {
    redirect("/dashboard");
  }

  const currentPlan = company.plan.toUpperCase();

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Planos e Assinatura
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Consulte seu plano atual e compare as opções disponíveis
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-blue-700">
              Plano atual
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-3xl font-bold text-blue-700 md:text-4xl">
                {currentPlan}
              </p>

              <span className="inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                Assinatura ativa
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              className={`flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6 ${
                currentPlan === "START"
                  ? "border-2 border-blue-500"
                  : "border border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  START
                </h2>

                {currentPlan === "START" && (
                  <span className="whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Plano atual
                  </span>
                )}
              </div>

              <p className="mt-5 text-4xl font-bold text-slate-900">
                R$ 19,90
              </p>

              <p className="mt-1 text-sm text-slate-500">
                por mês
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700 sm:text-base">
                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Até 100 produtos
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  1 usuário
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Relatórios básicos
                </li>
              </ul>

              {currentPlan === "START" ? (
                <div className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  Você está neste plano
                </div>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-3 font-medium text-slate-500"
                >
                  Plano indisponível
                </button>
              )}
            </article>

            <article
              className={`flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6 ${
                currentPlan === "PRO"
                  ? "border-2 border-blue-500"
                  : "border border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  PRO
                </h2>

                {currentPlan === "PRO" ? (
                  <span className="whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Plano atual
                  </span>
                ) : (
                  <span className="whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    Mais escolhido
                  </span>
                )}
              </div>

              <p className="mt-5 text-4xl font-bold text-slate-900">
                R$ 39,90
              </p>

              <p className="mt-1 text-sm text-slate-500">
                por mês
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700 sm:text-base">
                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Até 1.000 produtos
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  5 usuários
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Exportação CSV
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Relatórios avançados
                </li>
              </ul>

              {currentPlan === "PRO" ? (
                <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700">
                  Você está neste plano
                </div>
              ) : (
                <a
                  href="https://SEU-LINK-CAKTO-PRO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-700"
                >
                  Assinar PRO
                </a>
              )}
            </article>

            <article
              className={`flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:col-span-2 xl:col-span-1 ${
                currentPlan === "BUSINESS"
                  ? "border-2 border-green-500"
                  : "border border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  BUSINESS
                </h2>

                {currentPlan === "BUSINESS" && (
                  <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Plano atual
                  </span>
                )}
              </div>

              <p className="mt-5 text-4xl font-bold text-slate-900">
                R$ 49,90
              </p>

              <p className="mt-1 text-sm text-slate-500">
                por mês
              </p>

              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700 sm:text-base">
                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Produtos ilimitados
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Usuários ilimitados
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Suporte prioritário
                </li>

                <li className="flex gap-2">
                  <span
                    className="font-bold text-green-600"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  Todas as funcionalidades
                </li>
              </ul>

              {currentPlan === "BUSINESS" ? (
                <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
                  Você está neste plano
                </div>
              ) : (
                <a
                  href="https://SEU-LINK-CAKTO-BUSINESS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full rounded-xl bg-green-600 px-4 py-3 text-center font-medium text-white transition hover:bg-green-700"
                >
                  Assinar BUSINESS
                </a>
              )}
            </article>
          </section>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:p-5">
            Os botões de assinatura ainda utilizam links provisórios.
            Antes da venda oficial, será necessário substituir os endereços
            da Cakto pelos links reais dos planos.
          </div>
        </div>
      </main>
    </AppShell>
  );
}