import { AppShell } from "@/components/app-shell";
import { updateCompany } from "@/actions/company";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { requirePermission } from "@/lib/require-permission";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(user.role, "settings");

  const company = await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
  });

  if (!company) {
    redirect("/dashboard");
  }

  return (
    <AppShell role={user.role}>
      <main className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Configurações da Empresa
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Atualize os dados principais da sua empresa
            </p>
          </header>

          <section className="max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Dados da empresa
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Essas informações identificam sua empresa dentro do sistema.
              </p>
            </div>

            <form
              action={updateCompany}
              className="space-y-5 p-4 sm:p-6 md:p-8"
            >
              <div>
                <label
                  htmlFor="company-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nome da Empresa
                </label>

                <input
                  id="company-name"
                  name="name"
                  type="text"
                  defaultValue={company.name}
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="company-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="company-email"
                  name="email"
                  type="email"
                  defaultValue={company.email}
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="empresa@exemplo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="company-phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Telefone
                </label>

                <input
                  id="company-phone"
                  name="phone"
                  type="tel"
                  defaultValue={company.phone || ""}
                  className="w-full rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                />
              </div>

              <div className="border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 sm:w-auto"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </AppShell>
  );
}