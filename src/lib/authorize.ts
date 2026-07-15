import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";

export function requirePermission(
  role: string,
  permission: string
) {
  if (
    !hasPermission(
      role,
      permission
    )
  ) {
    redirect("/dashboard");
  }
}