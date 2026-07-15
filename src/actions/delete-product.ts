"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { requirePermission } from "@/lib/require-permission";
import { redirect } from "next/navigation";

export async function deleteProduct(
productId: string
) {
const user = await getUser();

if (!user) {
throw new Error("Não autorizado");
}

requirePermission(
user.role,
"products",
true
);

const product =
await prisma.product.findFirst({
where: {
id: productId,
companyId: user.companyId,
},
});

if (!product) {
throw new Error(
"Produto não encontrado"
);
}

await prisma.auditLog.create({
data: {
companyId: user.companyId,
userId: user.userId,


  action: "PRODUTO_EXCLUIDO",

  productId: product.id,
  productName: product.name,

  oldStock: product.stock,
  newStock: 0,
  difference: -product.stock,
},


});

await prisma.product.delete({
where: {
id: product.id,
},
});

redirect("/products");
}
