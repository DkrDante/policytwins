import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Supported languages
export const locales = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'] as const
export type Locale = (typeof locales)[number]

// Language names in their native scripts
export const languageNames = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  mr: 'मराठी',
  ta: 'தமிழ்',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ'
} as const

// Language flags/emojis
export const languageFlags = {
  en: '🇺🇸',
  hi: '🇮🇳',
  bn: '🇧🇩',
  te: '🇮🇳',
  mr: '🇮🇳',
  ta: '🇮🇳',
  gu: '🇮🇳',
  kn: '🇮🇳',
  ml: '🇮🇳',
  pa: '🇮🇳'
} as const

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound()

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
