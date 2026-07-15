import { registerCompany } from "@/actions/register";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Criar Conta
          </h1>

          <p className="text-slate-500 mt-2">
            Comece a usar o Estoque Fácil
          </p>
        </div>

        <form
          action={registerCompany}
          className="space-y-4"
        >
          <input
            name="companyName"
            placeholder="Nome da Empresa"
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              p-3
            "
          />

          <input
            name="userName"
            placeholder="Seu Nome"
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              p-3
            "
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              p-3
            "
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className="
              w-full
              border
              border-slate-300
              rounded-xl
              p-3
            "
          />

          <button
            type="submit"
            className="
              w-full
              bg-slate-900
              hover:bg-slate-800
              text-white
              py-3
              rounded-xl
              font-medium
            "
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900"
          >
            Já tenho conta
          </Link>
        </div>

      </div>
    </div>
  );
}