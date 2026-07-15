"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function exportProductsCSV() {
  const user = await getUser();

  if (!user) {
    throw new Error("Não autorizado");
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

  return header + rows;
}