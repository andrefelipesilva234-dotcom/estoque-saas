import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  const products = await prisma.product.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const header =
    "Produto,Categoria,SKU,Estoque,Minimo\n";

  const rows = products
    .map(
      (product) =>
        `${product.name},${product.category},${product.sku},${product.stock},${product.minimumStock}`
    )
    .join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        'attachment; filename="estoque-relatorio.csv"',
    },
  });
}