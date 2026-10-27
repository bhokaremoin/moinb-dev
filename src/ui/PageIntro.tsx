/** The eyebrow, title and one-line intro that open every index page. */
export function PageIntro({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <header>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-[clamp(1.9rem,5vw,2.6rem)] tracking-[-0.015em]">
        {title}
      </h1>
      <p className="text-muted mt-3">{intro}</p>
    </header>
  );
}
