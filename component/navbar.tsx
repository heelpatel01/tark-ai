"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Github, ExternalLink } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Personas", href: "/persona" },
  { label: "About", href: "/#about" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="mx-auto px-4 md:px-6 max-w-7xl">
          <div
            className={`glass border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] px-5 py-2.5 flex items-center justify-between transition-all duration-300 ${
              scrolled ? "shadow-[5px_5px_0px_0px_rgba(0,0,0,0.95)]" : ""
            }`}
          >
            {/* ── Logo ── */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <img
                src="/tarkai-logo-navbar.png"
                alt="Tark AI"
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.04]"
              />
              <div className="hidden sm:flex flex-col border-l-2 border-black/15 pl-2.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">
                  Reason. Learn. Build.
                </span>
              </div>
            </button>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNav(href)}
                  className="nav-link uppercase tracking-wider text-xs font-black text-black/80 hover:text-black"
                >
                  {label}
                </button>
              ))}

              {/* GitHub */}
              <a
                href="https://github.com/heelpatel01"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link flex items-center gap-1 uppercase tracking-wider text-xs font-black text-black/80 hover:text-black"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </nav>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => router.push("/persona")}
                className="
                  neo-btn
                  relative group overflow-hidden
                  bg-yellow-400 text-black
                  font-black text-xs uppercase tracking-wider
                  px-5 py-2.5
                  border-2 border-black
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  flex items-center gap-1.5
                "
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500"
                />
                <span className="relative flex items-center gap-1.5">
                  Talk to a Mentor
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </span>
              </button>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-yellow-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X className="w-4 h-4" strokeWidth={3} />
                : <Menu className="w-4 h-4" strokeWidth={3} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="relative mt-[72px] mx-4 glass border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 animate-slide-up-fade">
            <nav className="flex flex-col">
              {NAV_LINKS.map(({ label, href }, i) => (
                <button
                  key={label}
                  onClick={() => handleNav(href)}
                  className="text-left px-5 py-4 font-black uppercase text-sm tracking-wider text-black border-b-2 border-black/10 hover:bg-yellow-50 transition-colors"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {label}
                </button>
              ))}
              <a
                href="https://github.com/heelpatel01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-4 font-black uppercase text-sm tracking-wider text-black border-b-2 border-black/10 hover:bg-yellow-50 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
              </a>
              <div className="p-4">
                <button
                  onClick={() => { setMobileOpen(false); router.push("/persona"); }}
                  className="w-full neo-btn bg-yellow-400 text-black font-black text-sm uppercase tracking-wider py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
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
