import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(
request: Request
) {
const user = await getUser();

if (!user) {
return NextResponse.json(
{ error: "Não autorizado" },
{ status: 401 }
);
}

const { searchParams } =
new URL(request.url);

const startDate =
searchParams.get("startDate");

const endDate =
searchParams.get("endDate");

const where: any = {
product: {
companyId: user.companyId,
},
};

if (startDate || endDate) {
where.createdAt = {};
}

if (startDate) {
where.createdAt.gte = new Date(
startDate
);
}

if (endDate) {
const finalDate = new Date(
endDate
);

finalDate.setHours(
  23,
  59,
  59,
  999
);

where.createdAt.lte = finalDate;

}

const movements =
await prisma.stockMovement.findMany({
where,
include: {
product: true,
},
orderBy: {
createdAt: "desc",
},
});

const csv = [
[
"Produto",
"Tipo",
"Quantidade",
"Observacao",
"Data",
].join(","),
...movements.map((movement) =>
[
movement.product.name,
movement.type,
movement.quantity,
movement.observation || "",
movement.createdAt.toLocaleDateString(
"pt-BR"
),
].join(",")
),
].join("\n");

return new NextResponse(csv, {
headers: {
"Content-Type":
"text/csv;charset=utf-8",
"Content-Disposition":
'attachment; filename="movimentacoes.csv"',
},
});
}
