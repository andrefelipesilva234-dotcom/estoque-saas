"use server";

import { prisma } from "@/lib/prisma";

export async function createMovement(
formData: FormData
) {
const productId =
formData.get("productId") as string;

const type =
formData.get("type") as string;

const quantity = Number(
formData.get("quantity")
);

const observation =
formData.get(
"observation"
) as string;

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

let newStock =
product.stock;

if (type === "ENTRADA") {
newStock += quantity;
}

if (
type === "SAIDA" ||
type === "PERDA"
) {
newStock -= quantity;


if (newStock < 0) {
  throw new Error(
    "Estoque insuficiente"
  );
}


}

await prisma.stockMovement.create({
data: {
productId,
type,
quantity,
observation,
},
});

await prisma.product.update({
where: {
id: productId,
},
data: {
stock: newStock,
},
});

console.log(
"MOVIMENTAÇÃO CRIADA"
);

return {
success: true,
};
}
