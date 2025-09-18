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
import { translatePageContent } from "@/lib/translation-service"

interface LanguageSwitcherProps {
  currentLocale?: string
  onLanguageChange?: (locale: Locale) => void
}

export function LanguageSwitcher({ currentLocale = "en", onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  const handleLanguageChange = async (locale: Locale) => {
    console.log('Language change requested:', locale, 'Current:', currentLocale)
    
    if (locale === currentLocale) {
      setIsOpen(false)
      return
    }
    
    try {
      setIsTranslating(true)
      
      // Store language preference
      localStorage.setItem("preferred-language", locale)
      console.log('Language preference saved:', locale)
      
      // Notify parent component first
      onLanguageChange?.(locale)
      
      // Translate the page content
      try {
        await translatePageContent(locale)
        console.log('Page content translated to:', locale)
      } catch (translationError) {
        console.warn('Translation failed, but language preference saved:', translationError)
      }
      
    } catch (error) {
      console.error('Language change failed:', error)
    } finally {
      setIsTranslating(false)
      setIsOpen(false)
    }
  }

  const currentLanguage = currentLocale as Locale

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 min-w-[120px] justify-start"
          disabled={isTranslating}
        >
          <span className="text-lg">{languageFlags[currentLanguage]}</span>
          <span className="text-sm">
            {isTranslating ? "Translating..." : languageNames[currentLanguage]}
          </span>
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
            onClick={(e) => {
              e.preventDefault()
              console.log('Dropdown item clicked:', locale)
              handleLanguageChange(locale as Locale)
            }}
            className="flex items-center gap-3 cursor-pointer"
            disabled={isTranslating}
          >
            <span className="text-lg">{languageFlags[locale as Locale]}</span>
            <span className="flex-1">{name}</span>
            {locale === currentLanguage && (
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
