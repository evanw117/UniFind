"use client";

"use client";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "pill" | "ghost";
  size?: "sm" | "md";
};
export default function Button({ variant="primary", size="md", className="", ...props }: Props) {
  const base = "inline-flex items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition";
  const sizes = { sm: "px-3 py-2 text-sm", md: "px-4 py-2" }[size];
  const styles =
    variant === "primary"
      ? "rounded-lg bg-[var(--accent)] text-black hover:brightness-95 active:translate-y-px"
      : variant === "pill"
      ? "rounded-full border border-[var(--border)] bg-white hover:bg-white/80"
      : "rounded-lg hover:bg-slate-100";
  return <button className={`${base} ${sizes} ${styles} ${className}`} {...props} />;
}

