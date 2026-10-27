export function MoreLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-accent mt-[18px] inline-block font-medium no-underline hover:underline"
    >
      {children}
    </a>
  );
}
