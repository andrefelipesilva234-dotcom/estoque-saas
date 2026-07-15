"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerCompany(formData: FormData) {
  console.log("AÇÃO DE CADASTRO EXECUTADA");

  const companyName = formData.get("companyName") as string;
  const userName = formData.get("userName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Dados recebidos:", {
    companyName,
    userName,
    email,
  });

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  console.log("Verificação de usuário concluída");

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Senha criptografada");

  const company = await prisma.company.create({
    data: {
      name: companyName,
      email,
    },
  });

  console.log("Empresa criada:", company.id);

  await prisma.user.create({
    data: {
      companyId: company.id,
      name: userName,
      email,
      password: hashedPassword,
      role: "OWNER",
    },
  });

console.log("Usuário criado");

redirect("/login");
}