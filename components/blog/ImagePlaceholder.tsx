import React from "react";
import { ImageIcon } from "lucide-react";

export function ImagePlaceholder({ caption }: { caption: string }) {
  return (
    <div className="my-8">
      <div className="w-full aspect-[16/7] rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-center px-6">
        <ImageIcon size={22} className="text-[#667085] dark:text-[#94A3B8]" strokeWidth={1.75} />
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#667085] dark:text-[#94A3B8]">
          Image coming soon
        </p>
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-[#667085] dark:text-[#94A3B8]">
        {caption}
      </p>
    </div>
  );
}
