"use client";

import { useEffect, useState } from "react";

import { buttonClassName } from "./button-styles";
import { copyToClipboard } from "./copy-to-clipboard";

type CopyStatus = "idle" | "copied" | "failed";

const FEEDBACK_DURATION_MS = 1400;

const STATUS_LABELS: Record<Exclude<CopyStatus, "idle">, string> = {
  copied: "Copied",
  failed: "Copy failed",
};

export function CopyButton({
  text,
  label,
  className = buttonClassName(),
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }
    const timer = setTimeout(() => setStatus("idle"), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [status]);

  async function copyText() {
    const isCopied = await copyToClipboard(text);
    setStatus(isCopied ? "copied" : "failed");
  }

  return (
    <button type="button" className={className} onClick={copyText}>
      <span aria-live="polite">
        {status === "idle" ? label : STATUS_LABELS[status]}
      </span>
    </button>
  );
}
