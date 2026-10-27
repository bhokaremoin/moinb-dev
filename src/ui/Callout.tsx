export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside
      role="note"
      className="border-line bg-accent-soft my-5 rounded-lg border px-4 py-3 [&>p]:m-0"
    >
      {children}
    </aside>
  );
}
