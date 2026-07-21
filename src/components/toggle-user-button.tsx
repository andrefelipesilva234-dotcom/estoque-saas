"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleUser } from "@/actions/toggle-user";

interface ToggleUserButtonProps {
  userId: string;
  active: boolean;
}

export default function ToggleUserButton({
  userId,
  active,
}: ToggleUserButtonProps) {
  const router = useRouter();

  const [updating, setUpdating] =
    useState(false);

  async function handleClick() {
    if (updating) {
      return;
    }

    if (active) {
      const confirmed = window.confirm(
        "Deseja realmente desativar este usuário?"
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setUpdating(true);

      const formData = new FormData();

      formData.append("id", userId);

      await toggleUser(formData);

      router.refresh();
    } catch (error) {
      console.error(
        "Erro ao alterar o usuário:",
        error
      );

      window.alert(
        "Não foi possível alterar o status do usuário. Tente novamente."
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={updating}
      aria-label={
        active
          ? "Desativar usuário"
          : "Ativar usuário"
      }
      className={`
        inline-flex
        min-h-10
        w-full
        items-center
        justify-center
        rounded-xl
        px-4
        py-2
        text-sm
        font-semibold
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-60
        sm:w-auto
        ${
          active
            ? "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-200"
            : "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-200"
        }
      `}
    >
      {updating
        ? "Aguarde..."
        : active
          ? "Desativar"
          : "Ativar"}
    </button>
  );
}