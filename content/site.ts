// PLACEHOLDER: sample profile from the design demo. Replace every value with your real details.

export type ExperienceEntry = {
  period: string;
  role: string;
  company: string;
  impact: string;
  tags: string[];
};

export type SiteProfile = {
  name: string;
  status: string;
  location: string;
  headline: { before: string; emphasis: string; after: string };
  intro: string;
  email: string;
  resumePath: string;
  socials: { github: string; linkedin: string };
  experience: ExperienceEntry[];
  contact: { heading: string; body: string };
  builtWith: string;
};

export const site: SiteProfile = {
  name: "Moin B",
  status: "Open to full-stack roles",
  location: "Pune, India",
  headline: {
    before: "I build web products end to end, from ",
    emphasis: "database",
    after: " to pixel.",
  },
  intro:
    "Full-stack developer with 3 years of experience shipping TypeScript, React, Node.js and PostgreSQL apps. I care about fast interfaces, clean APIs and writing down what I learn.",
  email: "hello@moinb.dev",
  resumePath: "/resume.pdf",
  socials: {
    github: "https://github.com/bhokaremoin",
    linkedin: "https://www.linkedin.com/",
  },
  experience: [
    {
      period: "2024 — Now",
      role: "Software Engineer",
      company: "Acme Fintech",
      impact:
        "Lead developer on the merchant dashboard used by 4,000+ businesses. Cut page load time by 45% by moving reports to server components and streaming.",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
    },
    {
      period: "2022 — 2024",
      role: "Full-Stack Developer",
      company: "Brightloop",
      impact:
        "Built the booking and payments flow for a SaaS product from scratch. Owned the REST API, Stripe integration and CI pipeline.",
      tags: ["React", "Node.js", "Express", "Redis"],
    },
  ],
  contact: {
    heading: "Let's work together",
    body: "I'm looking for full-stack roles and occasional freelance work. I usually reply within a day.",
  },
  builtWith: "Built with Next.js, Tailwind & MDX",
};
