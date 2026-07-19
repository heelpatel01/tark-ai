import React from "react";

export function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-14 mb-5">
      {eyebrow && (
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6D5DF6] mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-[#F8FAFC] tracking-tight">
        {children}
      </h2>
    </div>
  );
}
