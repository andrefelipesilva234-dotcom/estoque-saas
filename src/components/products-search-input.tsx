"use client";

import {
useRouter,
useSearchParams,
} from "next/navigation";

import {
useEffect,
useState,
} from "react";

export default function ProductsSearchInput() {
const router = useRouter();

const searchParams =
useSearchParams();

const currentSearch =
searchParams.get("search") ||
"";

const [search, setSearch] =
useState(currentSearch);

useEffect(() => {
const timeout =
setTimeout(() => {
const params =
new URLSearchParams(
searchParams.toString()
);


    if (search) {
      params.set(
        "search",
        search
      );
    } else {
      params.delete(
        "search"
      );
    }

    params.set(
      "page",
      "1"
    );

    router.push(
      `/products?${params.toString()}`
    );
  }, 400);

return () =>
  clearTimeout(timeout);


}, [
search,
router,
searchParams,
]);

return (
<input
type="text"
value={search}
onChange={(e) =>
setSearch(
e.target.value
)
}
placeholder="Buscar por nome ou SKU..."
className="
w-full
md:w-80
border
border-slate-300
rounded-xl
px-4
py-3
outline-none
focus:ring-2
focus:ring-slate-400
"
/>
);
}
