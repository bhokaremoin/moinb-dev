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
  ariaLabel,
}: {
  ariaLabel?: string;
  /** A function is read at click time, for text that lives in the DOM. */
  text: string | (() => string);
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
    const isCopied = await copyToClipboard(
      typeof text === "function" ? text() : text,
    );
    setStatus(isCopied ? "copied" : "failed");
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={copyText}
    >
      <span aria-live="polite">
        {status === "idle" ? label : STATUS_LABELS[status]}
      </span>
    </button>
  );
}
