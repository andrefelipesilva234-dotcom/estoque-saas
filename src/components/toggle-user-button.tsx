"use client";

import { toggleUser } from "@/actions/toggle-user";

interface Props {
  userId: string;
  active: boolean;
}

export default function ToggleUserButton({
  userId,
  active,
}: Props) {
  async function handleClick() {
    const formData = new FormData();

    formData.append(
      "id",
      userId
    );

    await toggleUser(
      formData
    );
  }

  return (
    <button
      onClick={handleClick}
      className={
        active
          ? "px-3 py-1 rounded-lg bg-red-100 text-red-700"
          : "px-3 py-1 rounded-lg bg-green-100 text-green-700"
      }
    >
      {active
        ? "Desativar"
        : "Ativar"}
    </button>
  );
}