import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { UrduFontLoader } from "@/components/urdu-font-loader"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "INSAF Mineral Mining - Mining in Pakistan",
  description:
    "INSAF Mineral Mining - Reimagining mineral mining in Pakistan with expertise in gold, copper, rubies, aquamarine and marble exploration.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/insaf/logo.jpg",
        type: "image/jpeg",
      },
      {
        url: "/insaf/logo.jpg",
        sizes: "32x32",
        type: "image/jpeg",
      },
      {
        url: "/insaf/logo.jpg",
        sizes: "16x16",
        type: "image/jpeg",
      },
    ],
    apple: "/insaf/logo.jpg",
    shortcut: "/insaf/logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <UrduFontLoader />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
