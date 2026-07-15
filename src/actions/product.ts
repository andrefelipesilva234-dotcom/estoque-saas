"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(
  formData: FormData
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Não autorizado");
  }

  const company =
    await prisma.company.findUnique({
      where: {
        id: user.companyId,
      },
    });

  if (!company) {
    throw new Error(
      "Empresa não encontrada"
    );
  }

  const currentProducts =
    await prisma.product.count({
      where: {
        companyId: company.id,
      },
    });

  const limit =
    company.plan === "START"
      ? 100
      : company.plan === "PRO"
      ? 1000
      : 999999;

  if (currentProducts >= limit) {
    throw new Error(
      `Seu plano ${company.plan} atingiu o limite de produtos.`
    );
  }

  const name =
    formData.get("name") as string;

  const sku =
    formData.get("sku") as string;

  const category =
    formData.get("category") as string;

  const stock = Number(
    formData.get("stock")
  );

  const minimumStock = Number(
    formData.get("minimumStock")
  );

  await prisma.product.create({
    data: {
      companyId: company.id,
      name,
      sku,
      category,
      stock,
      minimumStock,
    },
  });

  revalidatePath("/products");
}