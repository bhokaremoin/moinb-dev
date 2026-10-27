export function MetricCards({
  metrics,
}: {
  metrics: { value: string; label: string }[];
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="border-line bg-surface rounded-lg border p-3.5"
        >
          <strong className="font-display text-accent block text-[1.6rem] tabular-nums">
            {metric.value}
          </strong>
          <span className="text-muted text-[0.85rem]">{metric.label}</span>
        </div>
      ))}
    </div>
  );
}
