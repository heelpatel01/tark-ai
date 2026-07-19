import React from "react";
import { Quote } from "lucide-react";

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 items-start rounded-2xl bg-gradient-to-br from-[#6D5DF6]/[0.06] to-transparent border-l-4 border-[#6D5DF6] px-5 py-4">
      <Quote size={16} className="text-[#6D5DF6] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
      <p className="text-base font-bold text-[#111111] dark:text-[#F8FAFC] leading-snug">
        {children}
      </p>
    </div>
  );
}
