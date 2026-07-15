import Link from "next/link";
import { login } from "@/actions/login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Estoque Fácil
          </h1>

          <p className="text-slate-500 mt-2">
            Faça login para acessar sua conta
          </p>
        </div>

        <form action={login} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                p-3
                focus:outline-none
                focus:ring-2
                focus:ring-slate-900
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Senha
            </label>

            <input
              type="password"
              name="password"
              required
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                p-3
                focus:outline-none
                focus:ring-2
                focus:ring-slate-900
              "
            />
          </div>

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
            Entrar
          </button>

        </form>

        <div className="mt-6 text-center">
          <Link
            href="/register"
            className="text-slate-600 hover:text-slate-900"
          >
            Criar conta
          </Link>
        </div>

      </div>
    </div>
  );
}