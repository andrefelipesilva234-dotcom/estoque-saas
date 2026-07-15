"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCompany(
  formData: FormData
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Não autorizado");
  }

  const name =
    formData.get("name") as string;

  const email =
    formData.get("email") as string;

  const phone =
    formData.get("phone") as string;

  await prisma.company.update({
    where: {
      id: user.companyId,
    },
    data: {
      name,
      email,
      phone,
    },
  });

  revalidatePath("/settings");
}