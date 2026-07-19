import React from "react";

export function ExampleBox({
  label,
  text,
  multiline,
  broken,
}: {
  label: string;
  text: string;
  multiline?: boolean;
  broken?: boolean;
}) {
  return (
    <div className="my-3 rounded-xl border border-[#6D5DF6]/15 bg-[#6D5DF6]/[0.04] dark:bg-[#7B61FF]/[0.06] px-4 py-3">
      <p className="text-[9px] font-bold uppercase tracking-widest text-[#6D5DF6] mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-semibold text-[#111111] dark:text-[#F8FAFC] ${multiline ? "whitespace-pre-line" : ""} ${broken ? "font-mono tracking-wide opacity-70" : ""}`}
      >
        {text}
      </p>
    </div>
  );
}
