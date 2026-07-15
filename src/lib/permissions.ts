type Role =
  | "OWNER"
  | "GERENTE"
  | "OPERADOR";

const permissions = {
  OWNER: [
    "dashboard",
    "products",
    "movements",
    "alerts",
    "reports",
    "audit",
    "users",
    "settings",
    "billing",
  ],

  GERENTE: [
    "dashboard",
    "products",
    "movements",
    "alerts",
    "reports",
    "audit",
  ],

  OPERADOR: [
    "dashboard",
    "products",
    "movements",
  ],
};

export function hasPermission(
  role: string,
  permission: string
) {
  return (
    permissions[
      role as Role
    ]?.includes(permission) ?? false
  );
}