"use client";

import type { ReactNode } from "react";
import {
  useEffect,
  useState,
} from "react";
import {
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

interface AppShellProps {
  role: string;
  children: ReactNode;
}

export function AppShell({
  role,
  children,
}: AppShellProps) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Barra lateral no computador */}
      <div className="hidden shrink-0 lg:block">
        <Sidebar role={role} />
      </div>

      <div className="min-w-0 flex-1">
        {/* Cabeçalho no celular */}
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMenuOpen(true)
            }
            aria-label="Abrir menu"
            aria-controls="mobile-sidebar"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <Menu
              size={24}
              aria-hidden="true"
            />
          </button>

          <span className="font-bold text-slate-900">
            Estoque SaaS
          </span>

          <div
            className="h-10 w-10"
            aria-hidden="true"
          />
        </header>

        <div className="min-w-0">
          {children}
        </div>
      </div>

      {/* Menu lateral no celular */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Fechar menu"
            className="absolute inset-0 z-0 bg-slate-950/60 backdrop-blur-[1px]"
          />

          <div
            id="mobile-sidebar"
            className="relative z-10 h-full w-72 max-w-[85vw] shadow-2xl"
          >
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Fechar menu"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X
                size={22}
                aria-hidden="true"
              />
            </button>

            <Sidebar role={role} />
          </div>
        </div>
      )}
    </div>
  );
}