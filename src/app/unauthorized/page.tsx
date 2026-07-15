import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Acesso Negado
        </h1>

        <p className="text-slate-600 mb-6">
          Você não possui permissão para acessar esta área.
        </p>

        <Link
          href="/dashboard"
          className="bg-slate-900 text-white px-6 py-3 rounded-xl"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}