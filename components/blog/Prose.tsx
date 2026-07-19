import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Prose — shared text styling for article body copy. Only direct <p>/<ul>/<ol>
// children get bottom spacing so nested elements (ExampleBox, PullQuote,
// SectionHeading) keep their own deliberate rhythm instead of double-margining.
// ─────────────────────────────────────────────────────────────────────────────
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        text-[15px] leading-relaxed text-[#4B5563] dark:text-[#CBD5E1]
        [&_strong]:text-[#111111] dark:[&_strong]:text-[#F8FAFC]
        [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[#111111] dark:[&_em]:text-[#F8FAFC]
        [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4
      "
    >
      {children}
    </div>
  );
}
