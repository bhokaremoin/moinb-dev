import * as runtime from "react/jsx-runtime";

import { mdxComponents, type MdxComponents } from "./mdx-components";

type RenderMdx = (props: { components?: MdxComponents }) => React.ReactNode;

/** Velite compiles MDX into a function body that expects the JSX runtime as its argument. */
function evaluateMdx(code: string): RenderMdx {
  const createModule = new Function(code);
  return createModule({ ...runtime }).default;
}

export function MdxContent({
  code,
  components,
}: {
  code: string;
  components?: MdxComponents;
}) {
  // Compiled MDX content uses no hooks, so it is called as a plain function. Rendering it as
  // <Content /> would create a new component type on every render and remount the subtree.
  const renderMdx = evaluateMdx(code);
  return renderMdx({ components: { ...mdxComponents, ...components } });
}
