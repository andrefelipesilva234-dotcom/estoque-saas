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

const variantStyles: Record<
  Variant,
  {
    border: string;
    value: string;
    background: string;
    badge: string;
  }
> = {
  default: {
    border: "border-l-blue-500",
    value: "text-slate-900",
    background: "bg-white",
    badge: "bg-blue-100",
  },

  danger: {
    border: "border-l-red-500",
    value: "text-red-600",
    background: "bg-red-50/40",
    badge: "bg-red-100",
  },

  warning: {
    border: "border-l-amber-500",
    value: "text-amber-600",
    background: "bg-amber-50/40",
    badge: "bg-amber-100",
  },
};

export function KpiCard({
  title,
  value,
  description,
  variant = "default",
}: KpiCardProps) {
  const styles =
    variantStyles[variant];

  return (
    <article
      className={`
        relative
        h-full
        min-h-36
        overflow-hidden
        rounded-2xl
        border
        border-l-4
        border-slate-200
        ${styles.border}
        ${styles.background}
        p-5
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        sm:min-h-40
        sm:p-6
      `}
    >
      <div
        className={`
          absolute
          -right-6
          -top-6
          h-20
          w-20
          rounded-full
          opacity-50
          ${styles.badge}
        `}
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {title}
        </p>

        <p
          className={`
            mt-3
            break-words
            text-3xl
            font-bold
            leading-tight
            sm:text-4xl
            ${styles.value}
          `}
        >
          {value}
        </p>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}