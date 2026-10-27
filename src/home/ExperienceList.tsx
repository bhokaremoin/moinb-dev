import { site } from "@content/site";
import { MoreLink } from "@/ui/MoreLink";
import { PageSection } from "@/ui/PageSection";
import { TagList } from "@/ui/TagList";

export function ExperienceList() {
  return (
    <PageSection id="about" title="Experience">
      <div className="grid gap-7">
        {site.experience.map((entry) => (
          <div
            key={`${entry.company}-${entry.period}`}
            className="grid gap-4 sm:grid-cols-[120px_1fr]"
          >
            <span className="text-muted font-mono text-[0.8rem]">
              {entry.period}
            </span>
            <div className="min-w-0">
              <h3 className="font-sans text-base font-semibold">
                {entry.role} · {entry.company}
              </h3>
              <p className="text-muted mt-1.5 mb-2.5">{entry.impact}</p>
              <TagList tags={entry.tags} />
            </div>
          </div>
        ))}
      </div>
      <MoreLink href={site.resumePath}>View full résumé →</MoreLink>
    </PageSection>
  );
}
