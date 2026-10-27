import { site } from "@content/site";
import { ButtonLink } from "@/ui/ButtonLink";
import { CopyButton } from "@/ui/CopyButton";

export function ContactBox() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-line bg-surface mt-16 rounded-xl border p-7"
    >
      <h2 id="contact-heading" className="text-[1.6rem]">
        {site.contact.heading}
      </h2>
      <p className="text-muted">{site.contact.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <a
          href={`mailto:${site.email}`}
          className="bg-code rounded-md px-3 py-2 font-mono no-underline select-all"
        >
          {site.email}
        </a>
        <CopyButton text={site.email} label="Copy email" />
        <ButtonLink href={site.socials.linkedin}>LinkedIn</ButtonLink>
      </div>
    </section>
  );
}
