"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Github, ExternalLink } from "lucide-react";
import ThemeToggle from "@/component/ThemeToggle";
import ThemeLogo from "@/component/ThemeLogo";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Personas", href: "/persona" },
  { label: "Consensus", href: "/self-consistency" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      if (pathname !== "/") {
        router.push(href);
      } else {
        const id = href.replace("/#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"
          }`}
      >
        <div className="mx-auto px-4 md:px-6 max-w-7xl">
          <div
            className={`transition-all duration-300 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md px-6 py-3 flex items-center justify-between ${scrolled
              ? "shadow-[0_8px_30px_rgba(0,0,0,0.03)] border-black/10 bg-white/80"
              : ""
              }`}
          >
            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <ThemeLogo className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <div className="hidden sm:flex flex-col border-l border-black/10 pl-2.5">
                <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest leading-none">
                  Mentor Platform
                </span>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNav(href)}
                  className="text-xs font-semibold text-[#4B5563] hover:text-[#111827] uppercase tracking-wider transition-colors"
                >
                  {label}
                </button>
              ))}

              <a
                href="https://github.com/heelpatel01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#4B5563] hover:text-[#111827] flex items-center gap-1.5 uppercase tracking-wider transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => router.push("/persona")}
                className="
                  btn-primary
                  font-bold text-xs uppercase tracking-wider
                  px-6 py-2.5 flex items-center gap-1
                "
              >
                <span>Talk to a Mentor</span>
                <span>→</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 rounded-xl border border-black/5 bg-white/50 backdrop-blur-md flex items-center justify-center hover:bg-white/80 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4 text-[#111827]" strokeWidth={2.5} />
              ) : (
                <Menu className="w-4 h-4 text-[#111827]" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#FAF9F5]/40 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="relative mt-24 mx-4 border border-black/5 bg-white/95 backdrop-blur-xl dark:bg-black/90 rounded-2xl shadow-xl p-6 z-50 animate-message-appear">
            <div className="flex justify-between items-center px-4 py-3 mb-2 border-b border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Appearance</span>
              <ThemeToggle />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }, i) => (
                <button
                  key={label}
                  onClick={() => handleNav(href)}
                  className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-widest text-[#111827] hover:bg-black/5 rounded-xl transition-colors"
                >
                  {label}
                </button>
              ))}
              <a
                href="https://github.com/heelpatel01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 font-semibold uppercase text-xs tracking-widest text-[#111827] hover:bg-black/5 rounded-xl transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-40" />
              </a>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/persona");
                  }}
                  className="w-full btn-primary font-bold text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2"
                >
                  Talk to a Mentor →
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
