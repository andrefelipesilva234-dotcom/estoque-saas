"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/require-permission";

export async function adjustStock(
  formData: FormData
) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  requirePermission(
    user.role,
    "inventory"
  );

  const productId =
    formData.get("productId") as string;

  const type =
    formData.get("type") as string;

  const quantity =
    Number(formData.get("quantity"));

  const observation =
    (formData.get("observation") as string) || "";

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

  let newStock = product.stock;

  if (type === "ENTRY") {
    newStock += quantity;
  }

  if (type === "EXIT") {
    newStock -= quantity;
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
      companyId: user.companyId,
      userId: user.userId,

      action: "ESTOQUE_AJUSTADO",

      productId: product.id,
      productName: product.name,

      oldStock: product.stock,
      newStock,

      difference:
        newStock - product.stock,
    },
  });

  redirect("/products");
}