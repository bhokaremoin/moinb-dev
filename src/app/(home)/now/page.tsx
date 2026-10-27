import type { Metadata } from "next";

import { ContentPage, contentPageMetadata } from "@/content/ContentPage";

export const metadata: Metadata = contentPageMetadata("now");

export default function NowPage() {
  return <ContentPage slug="now" />;
}
