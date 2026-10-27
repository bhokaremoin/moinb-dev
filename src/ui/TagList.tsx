export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {tags.map((tag) => (
        <li
          key={tag}
          className="bg-accent-soft text-accent rounded-full px-2 py-0.5 font-mono text-[0.72rem]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
