"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import {
  Search,
  X,
} from "lucide-react";

export default function ProductsSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  const currentSearch =
    searchParams.get("search") || "";

  const currentQuery =
    searchParams.toString();

  const [search, setSearch] =
    useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const normalizedSearch =
        search.trim();

      if (
        normalizedSearch ===
        currentSearch
      ) {
        return;
      }

      const params =
        new URLSearchParams(
          currentQuery
        );

      if (normalizedSearch) {
        params.set(
          "search",
          normalizedSearch
        );
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const query =
        params.toString();

      router.replace(
        query
          ? `${pathname}?${query}`
          : pathname,
        {
          scroll: false,
        }
      );
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    search,
    currentSearch,
    currentQuery,
    pathname,
    router,
  ]);

  function clearSearch() {
    setSearch("");
  }

  return (
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="search"
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value
          )
        }
        placeholder="Buscar por nome ou SKU..."
        aria-label="Buscar produtos por nome ou SKU"
        autoComplete="off"
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          py-3
          pl-11
          pr-11
          text-slate-900
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      />

      {search && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Limpar busca"
          title="Limpar busca"
          className="
            absolute
            right-2
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-900
          "
        >
          <X
            size={17}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}