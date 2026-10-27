export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-muted hover:text-foreground text-[0.9rem] no-underline"
    >
      {children}
    </a>
  );
}
