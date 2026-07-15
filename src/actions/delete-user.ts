"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteUser(
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

  if (
    targetUser.role ===
    "PROPRIETARIO"
  ) {
    throw new Error(
      "Não é permitido excluir o proprietário"
    );
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  revalidatePath("/team");
}