import { ProjectThumbnail } from "./ProjectThumbnail";

/** 16:9 frame for the case-study screenshot; shows the decorative thumbnail until one is added. */
export function ScreenshotFrame() {
  return (
    <figure className="border-line bg-code mt-7 aspect-video overflow-hidden rounded-[10px] border [&>div]:h-full [&>div]:rounded-none [&>div]:border-0">
      <ProjectThumbnail />
    </figure>
  );
}
