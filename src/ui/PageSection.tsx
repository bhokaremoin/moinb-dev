/** A labelled page region whose heading uses the small uppercase "eyebrow" style. */
export function PageSection({
  id,
  title,
  className = "mt-16",
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={className}>
      <h2 id={headingId} className="eyebrow">
        {title}
      </h2>
      {children}
    </section>
  );
}
