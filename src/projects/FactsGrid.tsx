type CaseStudyFacts = {
  role: string;
  timeline: string;
  stack: string[];
  users: string;
};

export function FactsGrid({ project }: { project: CaseStudyFacts }) {
  const facts = [
    { term: "Role", detail: project.role },
    { term: "Timeline", detail: project.timeline },
    { term: "Stack", detail: project.stack.join(", ") },
    { term: "Users", detail: project.users },
  ];

  return (
    <dl className="border-line bg-line mt-7 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-px overflow-hidden rounded-[10px] border">
      {facts.map((fact) => (
        <div key={fact.term} className="bg-surface px-4 py-3.5">
          <dt className="text-muted font-mono text-[0.7rem] tracking-[0.08em] uppercase">
            {fact.term}
          </dt>
          <dd className="mt-1 font-medium">{fact.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
