"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DeleteProductButton from "@/components/delete-product-button";

import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Pencil,
  Package,
  History,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  category: string | null;
  stock: number;
  minimumStock: number;
}

interface ProductSearchProps {
  products: Product[];
}

export default function ProductSearch({
  products,
}: ProductSearchProps) {
  const searchParams = useSearchParams();

  const currentSort =
    searchParams.get("sort") || "createdAt";

  const currentOrder =
    searchParams.get("order") || "desc";

  function getSortLink(field: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    const nextOrder =
      currentSort === field &&
      currentOrder === "asc"
        ? "desc"
        : "asc";

    params.set("sort", field);
    params.set("order", nextOrder);
    params.set("page", "1");

    return `/products?${params.toString()}`;
  }

  function SortIcon({
    field,
  }: {
    field: string;
  }) {
    if (currentSort !== field) {
      return (
        <ArrowUpDown
          size={14}
          className="shrink-0 text-slate-400"
          aria-hidden="true"
        />
      );
    }

    return currentOrder === "asc" ? (
      <ArrowUp
        size={14}
        className="shrink-0 text-slate-700"
        aria-hidden="true"
      />
    ) : (
      <ArrowDown
        size={14}
        className="shrink-0 text-slate-700"
        aria-hidden="true"
      />
    );
  }

  function getProductStatus(product: Product) {
    const critical =
      product.stock <=
      product.minimumStock / 2;

    const lowStock =
      product.stock <=
      product.minimumStock;

    if (critical) {
      return {
        label: "Crítico",
        className:
          "bg-red-100 text-red-700",
      };
    }

    if (lowStock) {
      return {
        label: "Baixo",
        className:
          "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "Normal",
      className:
        "bg-green-100 text-green-700",
    };
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 px-4 py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Nenhum produto encontrado
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Tente alterar a pesquisa ou cadastre um novo produto.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Ordenação no celular */}
      <div className="mb-4 md:hidden">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Ordenar por
        </p>

        <div className="grid grid-cols-3 gap-2">
          <Link
            href={getSortLink("name")}
            className={
              currentSort === "name"
                ? "flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-medium text-white"
                : "flex items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700"
            }
          >
            Nome
            <SortIcon field="name" />
          </Link>

          <Link
            href={getSortLink("category")}
            className={
              currentSort === "category"
                ? "flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-medium text-white"
                : "flex items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700"
            }
          >
            Categoria
            <SortIcon field="category" />
          </Link>

          <Link
            href={getSortLink("stock")}
            className={
              currentSort === "stock"
                ? "flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-medium text-white"
                : "flex items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-700"
            }
          >
            Estoque
            <SortIcon field="stock" />
          </Link>
        </div>
      </div>

      {/* Versão para celular */}
      <div className="space-y-4 md:hidden">
        {products.map((product) => {
          const status =
            getProductStatus(product);

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-slate-900">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      SKU:{" "}
                      {product.sku ||
                        "Não informado"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Estoque
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {product.stock}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Mínimo
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {product.minimumStock}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Categoria
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-slate-700">
                    {product.category ||
                      "Não informada"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-200 bg-slate-50 p-3">
                <Link
                  href={`/products/edit/${product.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  aria-label={`Editar ${product.name}`}
                >
                  <Pencil
                    size={15}
                    aria-hidden="true"
                  />
                  Editar
                </Link>

                <Link
                  href={`/products/adjust/${product.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  aria-label={`Ajustar estoque de ${product.name}`}
                >
                  <Package
                    size={15}
                    aria-hidden="true"
                  />
                  Ajustar
                </Link>

                <Link
                  href={`/products/history/${product.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  aria-label={`Ver histórico de ${product.name}`}
                >
                  <History
                    size={15}
                    aria-hidden="true"
                  />
                  Histórico
                </Link>
              </div>

              <div className="border-t border-slate-200 p-3">
                <DeleteProductButton
                  productId={product.id}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Versão para computador */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full min-w-[1050px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Link
                  href={getSortLink("name")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-900"
                >
                  Produto
                  <SortIcon field="name" />
                </Link>
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                SKU
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Link
                  href={getSortLink("category")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-900"
                >
                  Categoria
                  <SortIcon field="category" />
                </Link>
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Link
                  href={getSortLink("stock")}
                  className="inline-flex items-center gap-1 transition hover:text-slate-900"
                >
                  Estoque
                  <SortIcon field="stock" />
                </Link>
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mínimo
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product, index) => {
                const status =
                  getProductStatus(product);

                return (
                  <tr
                    key={product.id}
                    className={
                      index % 2 === 0
                        ? "border-t border-slate-100 bg-white transition hover:bg-slate-50"
                        : "border-t border-slate-100 bg-slate-50/60 transition hover:bg-slate-100"
                    }
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.sku || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.category ||
                        "-"}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {product.stock}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {product.minimumStock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/products/edit/${product.id}`}
                          title="Editar produto"
                          aria-label={`Editar ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                        >
                          <Pencil
                            size={16}
                            aria-hidden="true"
                          />
                        </Link>

                        <Link
                          href={`/products/adjust/${product.id}`}
                          title="Ajustar estoque"
                          aria-label={`Ajustar estoque de ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                        >
                          <Package
                            size={16}
                            aria-hidden="true"
                          />
                        </Link>

                        <Link
                          href={`/products/history/${product.id}`}
                          title="Ver histórico"
                          aria-label={`Ver histórico de ${product.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
                        >
                          <History
                            size={16}
                            aria-hidden="true"
                          />
                        </Link>

                        <DeleteProductButton
                          productId={product.id}
                        />
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}