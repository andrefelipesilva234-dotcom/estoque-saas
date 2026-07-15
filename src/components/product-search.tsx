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
  Trash2,
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
          className="inline ml-1 text-slate-400"
        />
      );
    }

    return currentOrder === "asc" ? (
      <ArrowUp
        size={14}
        className="inline ml-1 text-slate-700"
      />
    ) : (
      <ArrowDown
        size={14}
        className="inline ml-1 text-slate-700"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              <Link
                href={getSortLink("name")}
                className="flex items-center"
              >
                Produto
                <SortIcon field="name" />
              </Link>
            </th>

            <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              SKU
            </th>

            <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              <Link
                href={getSortLink("category")}
                className="flex items-center"
              >
                Categoria
                <SortIcon field="category" />
              </Link>
            </th>

            <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              <Link
                href={getSortLink("stock")}
                className="flex items-center"
              >
                Estoque
                <SortIcon field="stock" />
              </Link>
            </th>

            <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              Mínimo
            </th>

            <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              Status
            </th>

            <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => {
            const critical =
              product.stock <=
              product.minimumStock / 2;

            const lowStock =
              product.stock <=
              product.minimumStock;

            return (
              <tr
                key={product.id}
                className={
                  index % 2 === 0
                    ? "bg-white hover:bg-slate-50 transition"
                    : "bg-slate-50 hover:bg-slate-100 transition"
                }
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {product.name}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {product.sku || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {product.category || "-"}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  {product.minimumStock}
                </td>

                <td className="px-6 py-4">
                  {critical ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Crítico
                    </span>
                  ) : lowStock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Baixo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Normal
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/products/edit/${product.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                    >
                      <Pencil size={16} />
                    </Link>

                    <Link
                      href={`/products/adjust/${product.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                    >
                      <Package size={16} />
                    </Link>

                    <Link
                      href={`/products/history/${product.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                    >
                      <History size={16} />
                    </Link>

                    <DeleteProductButton
                      productId={product.id}
                    />
                  </div>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center py-12 text-slate-500"
              >
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}