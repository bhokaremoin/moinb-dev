import Link from "next/link";

export function MoreLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-accent mt-[18px] inline-block font-medium no-underline hover:underline"
    >
      {children}
    </Link>
  );
}
