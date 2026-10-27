type TocEntry = { title: string; url: string; items: TocEntry[] };

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ol className="m-0 list-none p-0 [&_ol]:pl-3.5">
      {entries.map((entry) => (
        <li key={entry.url}>
          <a
            href={entry.url}
            className="text-muted hover:text-accent block py-0.5 text-[0.9rem] no-underline"
          >
            {entry.title}
          </a>
          {entry.items.length > 0 && <TocList entries={entry.items} />}
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) {
    return null;
  }
  return (
    <nav
      aria-label="On this page"
      className="border-line mt-7 border-l-2 pl-3.5"
    >
      <TocList entries={entries} />
    </nav>
  );
}
