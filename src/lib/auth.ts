import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function getUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      companyId: user.companyId,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
    };
  } catch {
    return null;
  }
}