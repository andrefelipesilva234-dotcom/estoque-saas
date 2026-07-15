"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function updateProduct(
productId: string,
formData: FormData
) {
const user = await getUser();

if (!user) {
redirect("/login");
}

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

const name =
String(
formData.get("name") || ""
);

const sku =
String(
formData.get("sku") || ""
);

const category =
String(
formData.get("category") || ""
);

const minimumStock =
Number(
formData.get(
"minimumStock"
) || 0
);

await prisma.product.update({
where: {
id: product.id,
},


data: {
  name,
  sku,
  category,
  minimumStock,
},


});

await prisma.auditLog.create({
data: {
companyId: user.companyId,


  userId: user.userId,

  action:
    "PRODUTO_EDITADO",

  productId: product.id,

  productName: name,

  oldStock: product.stock,

  newStock: product.stock,

  difference: 0,
},


});

redirect("/products");
}
