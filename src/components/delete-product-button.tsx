"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
}

export default function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Deseja realmente excluir este produto? Essa ação não poderá ser desfeita."
    );

    if (!confirmed || deleting) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Não foi possível excluir o produto."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Erro ao excluir produto:",
        error
      );

      window.alert(
        "O produto não pôde ser excluído. Tente novamente."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Excluir produto"
      title="Excluir produto"
      className="
        inline-flex
        h-11
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-red-200
        px-4
        text-sm
        font-medium
        text-red-600
        transition
        hover:bg-red-50
        focus:outline-none
        focus:ring-2
        focus:ring-red-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        md:h-9
        md:w-9
        md:rounded-lg
        md:px-0
      "
    >
      <Trash2
        size={16}
        aria-hidden="true"
      />

      <span className="md:hidden">
        {deleting
          ? "Excluindo..."
          : "Excluir produto"}
      </span>
    </button>
  );
}