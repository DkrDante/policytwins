"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { languageNames, languageFlags, type Locale } from "@/lib/i18n"

export function SimpleLanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en")
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (locale: Locale) => {
    console.log('Changing language to:', locale)
    setCurrentLocale(locale)
    localStorage.setItem("preferred-language", locale)
    setIsOpen(false)
    
    // Simple alert to show it's working
    alert(`Language changed to ${languageNames[locale]}!`)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 min-w-[120px] justify-start"
        >
          <span className="text-lg">{languageFlags[currentLocale]}</span>
          <span className="text-sm">{languageNames[currentLocale]}</span>
          <svg
            className="w-4 h-4 ml-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(languageNames).map(([locale, name]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale as Locale)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{languageFlags[locale as Locale]}</span>
            <span className="flex-1">{name}</span>
            {locale === currentLocale && (
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

