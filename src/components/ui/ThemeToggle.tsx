"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // stockage indisponible (navigation privée, etc.) : le choix ne sera pas mémorisé
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer entre mode clair et mode sombre"
      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <Sun size={18} className="dark:hidden" />
      <Moon size={18} className="hidden dark:block" />
    </button>
  );
}
