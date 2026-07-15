type Variant =
  | "default"
  | "danger"
  | "warning";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  variant?: Variant;
}

export function KpiCard({
  title,
  value,
  description,
  variant = "default",
}: KpiCardProps) {
  const borderColor = {
    default: "border-l-slate-300",
    danger: "border-l-red-600",
    warning: "border-l-amber-600",
  };

  return (
    <div
      className={`
        bg-white
        rounded-2xl
        border
        border-slate-200
        border-l-4
        ${borderColor[variant]}
        p-6
        shadow-sm
        hover:shadow-md
        transition
      `}
    >
      <p className="uppercase tracking-widest text-[11px] text-slate-500 font-medium">
        {title}
      </p>

      <h2 className="text-3xl font-semibold text-slate-900 mt-3">
        {value}
      </h2>

      {description && (
        <p className="text-sm text-slate-500 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}