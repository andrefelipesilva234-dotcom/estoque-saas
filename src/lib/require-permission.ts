import { redirect } from "next/navigation";
import { hasPermission } from "./permissions";

export function requirePermission(
  role: string,
  permission: string,
  throwError = false
) {
  const allowed = hasPermission(
    role,
    permission
  );

  if (allowed) return;

  if (throwError) {
    throw new Error("Sem permissão");
  }

  redirect("/unauthorized");
}