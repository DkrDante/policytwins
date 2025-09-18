import type React from "react"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "PolicyTwin - See How Government Policies Affect You",
  description: "Create a personal digital twin and simulate the impact of tax reforms, subsidies, and government schemes. Understand policy effects through personalized, data-driven simulations.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
