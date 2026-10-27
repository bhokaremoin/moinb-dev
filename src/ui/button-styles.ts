export type ButtonVariant = "primary" | "secondary";

const BASE =
  "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[0.95rem] font-medium no-underline transition-colors cursor-pointer";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "border-foreground bg-foreground text-background hover:opacity-90",
  secondary: "border-line hover:border-muted",
};

export function buttonClassName(variant: ButtonVariant = "secondary"): string {
  return `${BASE} ${VARIANTS[variant]}`;
}
