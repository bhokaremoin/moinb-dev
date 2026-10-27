import type { Metadata } from "next";

import { ContentPage, contentPageMetadata } from "@/content/ContentPage";

export const metadata: Metadata = contentPageMetadata("uses");

export default function UsesPage() {
  return <ContentPage slug="uses" />;
}
