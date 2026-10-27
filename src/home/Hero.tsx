import { site } from "@content/site";
import { sectionUrl } from "@/routing/site-urls";
import { ButtonLink } from "@/ui/ButtonLink";

export function Hero() {
  return (
    <div>
      <p className="text-muted mb-5 inline-flex items-center gap-2 font-mono text-[0.8rem]">
        <span
          aria-hidden="true"
          className="bg-status size-2 rounded-full shadow-[0_0_0_4px_color-mix(in_srgb,var(--status)_20%,transparent)]"
        />
        {site.status} · {site.location}
      </p>
      <h1 className="text-[clamp(2rem,6vw,3rem)] font-bold tracking-[-0.02em]">
        {site.headline.before}
        <em className="text-accent not-italic">{site.headline.emphasis}</em>
        {site.headline.after}
      </h1>
      <p className="text-muted mt-[18px] max-w-[56ch] text-[1.1rem]">
        {site.intro}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <ButtonLink href={sectionUrl("projects")} variant="primary">
          See my work →
        </ButtonLink>
        <ButtonLink href={site.resumePath}>Résumé (PDF)</ButtonLink>
        <ButtonLink href="#contact">Get in touch</ButtonLink>
      </div>
    </div>
  );
}
