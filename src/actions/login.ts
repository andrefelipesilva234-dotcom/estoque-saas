"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
const email = formData.get("email") as string;
const password = formData.get("password") as string;

const user = await prisma.user.findFirst({
where: {
email,
},
});

if (!user) {
throw new Error("Usuário não encontrado");
}

if (!user.active) {
throw new Error("Usuário desativado");
}

const passwordMatch = await bcrypt.compare(
password,
user.password
);

if (!passwordMatch) {
throw new Error("Senha inválida");
}

const token = await createToken({
userId: user.id,
companyId: user.companyId,
email: user.email,
role: user.role,
});

const cookieStore = await cookies();

cookieStore.set("token", token, {
httpOnly: true,
secure: process.env.NODE_ENV === "production",
sameSite: "lax",
path: "/",
maxAge: 60 * 60 * 24 * 7,
});

redirect("/dashboard");
}
