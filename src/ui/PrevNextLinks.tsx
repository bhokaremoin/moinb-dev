import Link from "next/link";

type NeighbourLink = { label: string; title: string; href: string };

const LINK_CLASS =
  "rounded-lg border border-line p-3.5 no-underline hover:border-accent";

function Neighbour({
  link,
  align,
}: {
  link: NeighbourLink;
  align: "left" | "right";
}) {
  return (
    <Link
      href={link.href}
      className={`${LINK_CLASS} ${align === "right" ? "text-right sm:col-start-2" : ""}`}
    >
      <small className="text-muted block">{link.label}</small> {link.title}
    </Link>
  );
}

export function PrevNextLinks({
  previous,
  next,
}: {
  previous?: NeighbourLink;
  next?: NeighbourLink;
}) {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav aria-label="More" className="mt-12 grid gap-3 sm:grid-cols-2">
      {previous && <Neighbour link={previous} align="left" />}
      {next && <Neighbour link={next} align="right" />}
    </nav>
  );
}
