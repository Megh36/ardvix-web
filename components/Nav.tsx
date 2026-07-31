"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) setHidden(true);
      else setHidden(false);
      setLastY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        backgroundColor: "rgba(11, 11, 14, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(171, 184, 204, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/ardvix-mark.svg"
            alt=""
            width={28}
            height={28}
            priority
          />
          <span className="font-sans font-medium tracking-tight text-paper">
            ARDVIX
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-steel-mist">
          <a href="#services" className="hover:text-paper transition-colors">
            Services
          </a>
          <a href="#verticals" className="hover:text-paper transition-colors">
            Verticals
          </a>
          <a href="#process" className="hover:text-paper transition-colors">
            Process
          </a>
          <a href="#work" className="hover:text-paper transition-colors">
            Work
          </a>
        </div>

        <a
          href="#book"
          className="bg-copper text-obsidian font-medium text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Book a free audit
        </a>
      </div>
    </nav>
  );
}