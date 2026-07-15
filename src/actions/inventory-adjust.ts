"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function inventoryAdjust(
formData: FormData
) {
const user = await getUser();

if (!user) {
throw new Error("Não autorizado");
}

const productId = formData.get(
"productId"
) as string;

const physicalStock = Number(
formData.get("physicalStock")
);

const product =
await prisma.product.findUnique({
where: {
id: productId,
},
});

if (!product) {
throw new Error(
"Produto não encontrado"
);
}

const difference =
physicalStock - product.stock;

if (difference === 0) {
return;
}

await prisma.stockMovement.create({
data: {
productId,
type: "AJUSTE",
quantity: Math.abs(
difference
),
observation:
"Ajuste realizado por inventário",
},
});

await prisma.auditLog.create({
data: {
companyId: user.companyId,
userId: user.userId,

  action: "AJUSTE_INVENTARIO",

  productId: product.id,
  productName: product.name,

  oldStock: product.stock,
  newStock: physicalStock,

  difference,
},

});

await prisma.product.update({
where: {
id: product.id,
},
data: {
stock: physicalStock,
},
});
}
