"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface NavItem {
  href: string
  labelKey: "navHome" | "navSchemes" | "navCheck" | "navAsk" | "navProfile" | "navExplore"
  icon: React.ReactNode
  matchPaths?: string[]
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )
}

function SchemesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "navHome", icon: <HomeIcon className="w-6 h-6" /> },
  { href: "/explore", labelKey: "navExplore", icon: <SchemesIcon className="w-6 h-6" />, matchPaths: ["/explore", "/schemes"] },
  { href: "/debug", labelKey: "navCheck", icon: <CheckIcon className="w-6 h-6" />, matchPaths: ["/debug"] },
  { href: "/ask", labelKey: "navAsk", icon: <ChatIcon className="w-6 h-6" />, matchPaths: ["/ask"] },
  { href: "/profile", labelKey: "navProfile", icon: <ProfileIcon className="w-6 h-6" />, matchPaths: ["/profile"] },
]

interface BottomNavProps {
  className?: string
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname()
  const { t } = useTranslation()

  const isActive = (item: NavItem) => {
    if (item.href === "/" && pathname === "/") return true
    if (item.matchPaths) {
      return item.matchPaths.some((path) => pathname.startsWith(path))
    }
    return pathname === item.href
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "h-16 pb-safe",
        "bg-background border-t border-border",
        "flex items-center justify-around",
        className
      )}
      aria-label="Main navigation"
    >
      {navItems.map((item) => {
        const active = isActive(item)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              "w-full h-full",
              "touch-target",
              "transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.icon}
            <span className="text-xs font-medium">{t(item.labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
