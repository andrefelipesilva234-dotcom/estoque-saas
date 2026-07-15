"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleUser(
  formData: FormData
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Não autorizado");
  }

  const id =
    formData.get("id") as string;

  const targetUser =
    await prisma.user.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

  if (!targetUser) {
    throw new Error(
      "Usuário não encontrado"
    );
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      active: !targetUser.active,
    },
  });

  revalidatePath("/team");
}