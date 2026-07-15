import { registerCompany } from "@/actions/register";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-6">
          Criar Conta
        </h1>

        <form action={registerCompany} className="space-y-4">
          <input
            name="companyName"
            type="text"
            placeholder="Nome da empresa"
            className="w-full border p-3 rounded"
            required
          />

          <input
            name="userName"
            type="text"
            placeholder="Seu nome"
            className="w-full border p-3 rounded"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="w-full border p-3 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </main>
  );
}