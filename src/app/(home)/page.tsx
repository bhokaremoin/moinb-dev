import type { Metadata } from "next";

import { site } from "@content/site";
import { ContactBox } from "@/home/ContactBox";
import { ExperienceList } from "@/home/ExperienceList";
import { FeaturedProjects } from "@/home/FeaturedProjects";
import { Hero } from "@/home/Hero";
import { LatestPosts } from "@/home/LatestPosts";

import { pageMetadata } from "@/seo/page-metadata";

const HOME_TITLE = `${site.name} · Full-stack developer`;

export const metadata: Metadata = {
  ...pageMetadata({
    section: "home",
    path: "/",
    title: HOME_TITLE,
    description: site.intro,
  }),
  title: { absolute: HOME_TITLE },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExperienceList />
      <FeaturedProjects />
      <LatestPosts />
      <ContactBox />
    </>
  );
}
