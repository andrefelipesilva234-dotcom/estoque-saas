import { deleteProduct } from "@/actions/delete-product";

export async function DELETE(
  request: Request,
  { params }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { id } =
    await params;

  await deleteProduct(id);

  return Response.json({
    success: true,
  });
}