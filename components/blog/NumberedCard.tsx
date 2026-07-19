import React from "react";
import type { LucideIcon } from "lucide-react";

export function NumberedCard({
  index,
  icon: Icon,
  title,
  children,
}: {
  index: number;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl shadow-sm p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-[#6D5DF6]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-[#6D5DF6]" strokeWidth={2.25} />
        </div>
        <span className="text-[10px] font-black text-[#6D5DF6]/50 tracking-widest">
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="text-base sm:text-lg font-bold text-[#111111] dark:text-[#F8FAFC] tracking-tight">
          {title}
        </h3>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-[#4B5563] dark:text-[#CBD5E1] [&_strong]:text-[#111111] dark:[&_strong]:text-[#F8FAFC] [&_em]:not-italic [&_em]:font-semibold [&_em]:text-[#111111] dark:[&_em]:text-[#F8FAFC]">
        {children}
      </div>
    </div>
  );
}
