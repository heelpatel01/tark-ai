"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <header className="bg-white fixed top-0 right-4 left-4 md:right-50 md:left-50 w-auto z-50 border-3 rounded-2xl border-black mt-2">
      <div className="flex items-center justify-between px-6 pt-2 pb-2 max-w-7xl mx-auto w-full">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
              src="/tarkai-logo-navbar.png"
              alt="Tark AI Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col border-l border-black pl-2 ml-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">
                Reason. Learn. Build.
              </span>
            </div>
          </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/persona")}
            className="bg-sky-200 text-black px-6 py-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
          >
            Start Chat →
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
