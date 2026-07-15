import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { updateProduct } from "@/actions/update-product";

interface PageProps {
params: Promise<{
id: string;
}>;
}

export default async function EditProductPage({
params,
}: PageProps) {
const user = await getUser();

if (!user) {
redirect("/login");
}

const { id } = await params;

const product =
await prisma.product.findFirst({
where: {
id,
companyId: user.companyId,
},
});

if (!product) {
redirect("/products");
}

const updateAction =
updateProduct.bind(
null,
product.id
);

return ( <div className="flex min-h-screen bg-slate-50"> <Sidebar role={user.role} />


  <main className="flex-1 p-8">
    <div className="max-w-4xl">

      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Editar Produto
      </h1>

      <p className="text-slate-500 mb-8">
        {product.name}
      </p>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <form
          action={updateAction}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          <input
            name="name"
            defaultValue={product.name}
            placeholder="Nome"
            className="border border-slate-300 p-3 rounded-xl"
            required
          />

          <input
            name="sku"
            defaultValue={product.sku || ""}
            placeholder="SKU"
            className="border border-slate-300 p-3 rounded-xl"
          />

          <input
            name="category"
            defaultValue={product.category || ""}
            placeholder="Categoria"
            className="border border-slate-300 p-3 rounded-xl"
          />

          <input
            name="minimumStock"
            type="number"
            defaultValue={product.minimumStock}
            placeholder="Estoque mínimo"
            className="border border-slate-300 p-3 rounded-xl"
            required
          />

          <div className="md:col-span-2 flex gap-3 pt-4">

            <button
              type="submit"
              className="
                bg-slate-900
                hover:bg-slate-800
                text-white
                px-6
                py-3
                rounded-xl
                transition
              "
            >
              Salvar Alterações
            </button>

            <a
              href="/products"
              className="
                border
                border-slate-300
                px-6
                py-3
                rounded-xl
                hover:bg-slate-100
              "
            >
              Cancelar
            </a>

          </div>

        </form>

      </div>

    </div>
  </main>
</div>


);
}
