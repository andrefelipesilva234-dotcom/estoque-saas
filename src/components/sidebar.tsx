"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/logout";
import { hasPermission } from "@/lib/permissions";

import {
  LayoutDashboard,
  Package,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Users,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

export function Sidebar({
  role,
}: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      permission: "dashboard",
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      permission: "products",
      href: "/products",
      label: "Produtos",
      icon: Package,
    },
    {
      permission: "movements",
      href: "/movements",
      label: "Movimentações",
      icon: RefreshCw,
    },
    {
      permission: "alerts",
      href: "/alerts",
      label: "Alertas",
      icon: AlertTriangle,
    },
    {
      permission: "audit",
      href: "/audit",
      label: "Auditoria",
      icon: ClipboardCheck,
    },
    {
      permission: "reports",
      href: "/reports",
      label: "Relatórios",
      icon: BarChart3,
    },
    {
      permission: "users",
      href: "/users",
      label: "Usuários",
      icon: Users,
    },
  ];

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <aside className="flex h-full min-h-screen w-72 flex-col overflow-hidden bg-[#0F1729] text-white lg:sticky lg:top-0 lg:h-screen">
      <div className="shrink-0 border-b border-white/10 px-6 py-7">
        <h1 className="text-2xl font-bold">
          Estoque SaaS
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Gestão Profissional
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <div className="space-y-1">
          {menuItems.map((item) => {
            if (
              !hasPermission(
                role,
                item.permission
              )
            ) {
              return null;
            }

            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
                className={`
                  relative flex items-center gap-3 px-6 py-3
                  transition-colors
                  ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                {active && (
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-blue-500" />
                )}

                <Icon
                  size={19}
                  className="shrink-0"
                  aria-hidden="true"
                />

                <span className="font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mx-6 my-5 border-t border-white/10" />

        <div className="space-y-1">
          {hasPermission(
            role,
            "settings"
          ) && (
            <Link
              href="/settings"
              aria-current={
                isActive("/settings")
                  ? "page"
                  : undefined
              }
              className={`
                relative flex items-center gap-3 px-6 py-3
                transition-colors
                ${
                  isActive("/settings")
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {isActive("/settings") && (
                <span className="absolute inset-y-0 left-0 w-[3px] bg-blue-500" />
              )}

              <Settings
                size={19}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className="font-medium">
                Configurações
              </span>
            </Link>
          )}

          {hasPermission(
            role,
            "billing"
          ) && (
            <Link
              href="/billing"
              aria-current={
                isActive("/billing")
                  ? "page"
                  : undefined
              }
              className={`
                relative flex items-center gap-3 px-6 py-3
                transition-colors
                ${
                  isActive("/billing")
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {isActive("/billing") && (
                <span className="absolute inset-y-0 left-0 w-[3px] bg-blue-500" />
              )}

              <CreditCard
                size={19}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className="font-medium">
                Planos
              </span>
            </Link>
          )}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-5">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#0F1729]"
          >
            <LogOut
              size={18}
              aria-hidden="true"
            />

            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}