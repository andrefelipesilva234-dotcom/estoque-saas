import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { updateCompany } from "@/actions/company";
import { requirePermission } from "@/lib/require-permission";

export default async function SettingsPage() {
const user = await getUser();

if (!user) {
redirect("/login");
}

requirePermission(
  user.role,
  "settings"
);

const company = await prisma.company.findUnique({
where: {
id: user.companyId,
},
});

if (!company) {
redirect("/dashboard");
}

return ( <div className="flex min-h-screen bg-gray-100"> <Sidebar role={user.role} />

  <main className="flex-1 p-8">
    <h1 className="text-4xl font-bold mb-8">
      Configurações da Empresa
    </h1>

    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
      <form
        action={updateCompany}
        className="space-y-5"
      >
        <div>
          <label className="block mb-2 font-medium">
            Nome da Empresa
          </label>

          <input
            name="name"
            defaultValue={company.name}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            E-mail
          </label>

          <input
            name="email"
            defaultValue={company.email}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Telefone
          </label>

          <input
            name="phone"
            defaultValue={company.phone || ""}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  </main>
</div>

);
}
