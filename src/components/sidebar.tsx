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

  console.log(
    "ROLE SIDEBAR:",
    role
  );
  
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

  return (
    <aside className="w-72 min-h-screen bg-[#0F1729] text-white flex flex-col">
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="text-2xl font-bold">
          Estoque SaaS
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Gestão Profissional
        </p>
      </div>

      <nav className="flex-1 py-6">
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

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-6 py-3 transition-all
                ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" />
              )}

              <Icon size={18} />

              <span className="font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="border-t border-white/10 my-6" />

        {hasPermission(
          role,
          "settings"
        ) && (
          <Link
            href="/settings"
            className={`
              relative flex items-center gap-3 px-6 py-3 transition-all
              ${
                pathname === "/settings"
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {pathname ===
              "/settings" && (
              <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" />
            )}

            <Settings size={18} />

            <span>
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
            className={`
              relative flex items-center gap-3 px-6 py-3 transition-all
              ${
                pathname === "/billing"
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {pathname ===
              "/billing" && (
              <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500" />
            )}

            <CreditCard size={18} />

            <span>
              Planos
            </span>
          </Link>
        )}
      </nav>

      <div className="p-6 border-t border-white/10">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}