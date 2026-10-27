import { robotsResponse } from "@/seo/robots-text";

export function GET() {
  return robotsResponse("blog");
}
