/** Decorative stand-in for a screenshot, drawn from the theme so it works in light and dark. */
export function ProjectThumbnail() {
  const bar = "absolute right-[10%] left-[10%] h-[8%] rounded-[3px] bg-line";
  return (
    <div
      aria-hidden="true"
      className="border-line bg-code relative aspect-[4/3] overflow-hidden rounded-md border"
    >
      <i className={`${bar} bg-accent top-[14%] w-[40%]`} />
      <i className={`${bar} top-[32%]`} />
      <i className={`${bar} top-[46%] right-[35%]`} />
      <b className="border-line bg-surface absolute right-[10%] bottom-[12%] left-[10%] h-[22%] rounded border" />
    </div>
  );
}
