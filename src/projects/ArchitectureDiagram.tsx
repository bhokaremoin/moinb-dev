/** The system as a left-to-right chain of boxes, from frontmatter `architecture`. */
export function ArchitectureDiagram({ nodes }: { nodes: string[] }) {
  return (
    <ol
      aria-label="Architecture"
      className="mt-3 flex list-none flex-wrap items-center gap-2 p-0 font-mono text-[0.8rem]"
    >
      {nodes.map((node, index) => (
        <li key={node} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden="true" className="text-muted">
              →
            </span>
          )}
          <span className="border-line bg-surface rounded-md border px-2.5 py-1.5">
            {node}
          </span>
        </li>
      ))}
    </ol>
  );
}
