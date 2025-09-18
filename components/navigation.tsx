"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useState, useEffect } from "react"
import type { Locale } from "@/lib/i18n"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Avatars", href: "/avatars" },
  { name: "Chat", href: "/chat" },
  { name: "Results", href: "/results" },
  { name: "History", href: "/history" },
]

export function Navigation() {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState<Locale>("en")

  useEffect(() => {
    // Load saved language preference
    const savedLocale = localStorage.getItem("preferred-language") as Locale
    if (savedLocale) {
      setCurrentLocale(savedLocale)
    }
  }, [])

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/60 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight" data-translate>
            PolicyTwin
          </Link>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            {navigation.map((item) => {
              const active = pathname === item.href
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className="transition-colors duration-200"
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <span className="text-sm leading-none" data-translate>{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher 
              currentLocale={currentLocale} 
              onLanguageChange={setCurrentLocale}
            />
            <Button asChild variant="outline" size="sm" className="transition-all duration-200">
              <Link href="/auth/signin" data-translate>Sign In</Link>
            </Button>
            <Button asChild size="sm" className="transition-all duration-200">
              <Link href="/auth/signup" data-translate>Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
