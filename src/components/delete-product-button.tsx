"use client";

import { Trash2 } from "lucide-react";

interface Props {
  productId: string;
}

export default function DeleteProductButton({
  productId,
}: Props) {
  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Deseja realmente excluir este produto?"
      );

    if (!confirmed) return;

    await fetch(
      `/api/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="
        inline-flex
        items-center
        justify-center
        w-9
        h-9
        rounded-lg
        border
        border-red-200
        text-red-600
        hover:bg-red-50
        transition
      "
    >
      <Trash2 size={16} />
    </button>
  );
}