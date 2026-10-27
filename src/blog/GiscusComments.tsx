"use client";

import Giscus from "@giscus/react";

import { giscusConfig } from "./giscus-config";

export function GiscusComments() {
  if (!giscusConfig) {
    return null;
  }
  return (
    <section aria-label="Comments" className="mt-12">
      <Giscus
        {...giscusConfig}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
