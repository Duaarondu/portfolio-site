/**
 * CopyEmail.tsx — a word that copies your email address when clicked.
 *
 * Used in the footer strip instead of a mailto: link. mailto: opens
 * whatever mail app or site the visitor's browser is set to (often a
 * Google sign-in page), which can feel like the site broke. Copying
 * works everywhere; the word changes to "Copied" for a moment so the
 * visitor knows it worked.
 */
"use client";

import { useEffect, useState } from "react";

export function CopyEmail({
  email,
  label,
  className,
  tabIndex,
}: {
  email: string;
  label: string;
  className?: string;
  tabIndex?: number;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`; // clipboard blocked: fall back
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      tabIndex={tabIndex}
      title={`Copy ${email}`}
      className={`${className ?? ""} ${copied ? "text-verified" : ""}`}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
