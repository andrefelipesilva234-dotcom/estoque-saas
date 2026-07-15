"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { requirePermission } from "@/lib/require-permission";
import { redirect } from "next/navigation";

export async function adjustStock(
productId: string,
formData: FormData
) {
const user = await getUser();

if (!user) {
throw new Error("Não autorizado");
}

requirePermission(
user.role,
"movements",
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

const type = String(
formData.get("type")
);

const quantity = Number(
formData.get("quantity")
);

const observation = String(
formData.get("observation") || ""
);

let newStock =
product.stock;

if (type === "ENTRADA") {
newStock =
product.stock + quantity;
}

if (
type === "SAIDA" ||
type === "PERDA"
) {
newStock =
product.stock - quantity;
}

if (newStock < 0) {
throw new Error(
"Estoque não pode ficar negativo"
);
}

await prisma.product.update({
where: {
id: product.id,
},
data: {
stock: newStock,
},
});

await prisma.stockMovement.create({
data: {
productId: product.id,
type,
quantity,
observation,
},
});

await prisma.auditLog.create({
data: {
companyId:
user.companyId,

  userId:
    user.userId,

  action:
    "ESTOQUE_AJUSTADO",

  productId:
    product.id,

  productName:
    product.name,

  oldStock:
    product.stock,

  newStock,

  difference:
    newStock -
    product.stock,
},

});

redirect("/products");
}
