import { buttonClassName, type ButtonVariant } from "./button-styles";

export function ButtonLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={buttonClassName(variant)}>
      {children}
    </a>
  );
}
