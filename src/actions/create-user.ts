"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/require-permission";

export async function createUser(
  formData: FormData
) {
const user = await getUser();

if (!user) {
  throw new Error("Não autorizado");
}

requirePermission(
  user.role,
  "users",
  true
);

  const name =
    formData.get("name")?.toString() || "";

  const email =
    formData.get("email")?.toString() || "";

  const password =
    formData.get("password")?.toString() || "";

  const role =
    formData.get("role")?.toString() || "OPERADOR";

  const existingUser =
    await prisma.user.findFirst({
      where: {
        companyId: user.companyId,
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "Usuário já existe"
    );
  }

  const passwordHash =
    await hash(password, 10);

  await prisma.user.create({
    data: {
      companyId: user.companyId,
      name,
      email,
      password: passwordHash,
      role,
      active: true,
    },
  });

  revalidatePath("/users");
}