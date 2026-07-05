"use client"

import { useEffect, useState } from "react"

// Phase 9 — Dark mode toggle. Reads/writes "vita-theme" in localStorage,
// applies the `dark` class to <html>. Tailwind is configured darkMode:['class'].

type Mode = "light" | "dark" | "system" | "auto"
const STORAGE_KEY = "vita-theme"

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}
function isNightTime(): boolean {
  const h = new Date().getHours()
  return h >= 19 || h < 7
}

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return
  const isDark = mode === "dark"
    || (mode === "system" && systemPrefersDark())
    || (mode === "auto" && isNightTime())
  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Mode | null
      const start: Mode = stored === "light" || stored === "dark" || stored === "system" || stored === "auto" ? stored : "auto"
      applyMode(start)
      setIsDark(document.documentElement.classList.contains("dark"))
    } catch { /* no-op */ }
    // Auto : ré-évalue jour/nuit toutes les 10 min
    const tick = setInterval(() => {
      try {
        const m = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? "auto"
        if (m === "auto") { applyMode("auto"); setIsDark(document.documentElement.classList.contains("dark")) }
      } catch { /* no-op */ }
    }, 10 * 60 * 1000)
    return () => clearInterval(tick)
  }, [])

  const toggle = () => {
    const next: Mode = isDark ? "light" : "dark"
    applyMode(next)
    setIsDark(next === "dark")
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* no-op */ }
  }

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      onClick={toggle}
      title={isDark ? "Mode clair" : "Mode sombre"}
      aria-label="Basculer le thème"
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
      {isDark ? "☀️" : "🌙"}
    </button>
  )
}
