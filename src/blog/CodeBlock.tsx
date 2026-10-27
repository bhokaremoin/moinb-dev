"use client";

import { useRef } from "react";

import { CopyButton } from "@/ui/CopyButton";

/** Wraps rehype-pretty-code's <figure>: the filename caption becomes a header with a copy button. */
export function CodeBlock(props: React.ComponentProps<"figure">) {
  const figureRef = useRef<HTMLElement>(null);

  return (
    <figure ref={figureRef} {...props} className="code-block">
      {props.children}
      <CopyButton
        text={() => figureRef.current?.querySelector("pre")?.textContent ?? ""}
        label="Copy"
        ariaLabel="Copy code"
        className="icon-button code-block-copy"
      />
    </figure>
  );
}
