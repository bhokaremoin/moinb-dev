export function FilterChips({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="my-6 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === selected}
          onClick={() => onSelect(option)}
          className="border-line bg-surface text-muted hover:text-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background cursor-pointer rounded-full border px-3 py-1 font-mono text-[0.8rem] font-medium"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
