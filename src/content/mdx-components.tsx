import { Callout } from "@/ui/Callout";

export type MdxComponents = Record<string, React.ComponentType<never>>;

/** Components every MDX file can use. Pages add their own, e.g. case-study diagrams. */
export const mdxComponents: MdxComponents = {
  Callout,
};
