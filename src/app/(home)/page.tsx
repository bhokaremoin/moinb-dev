import { ContactBox } from "@/home/ContactBox";
import { ExperienceList } from "@/home/ExperienceList";
import { FeaturedProjects } from "@/home/FeaturedProjects";
import { Hero } from "@/home/Hero";
import { LatestPosts } from "@/home/LatestPosts";

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
