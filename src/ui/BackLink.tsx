import Link from "next/link";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-foreground text-[0.9rem] no-underline"
    >
      {children}
    </Link>
  );
}
