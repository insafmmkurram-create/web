"use client"

import { useEffect } from "react"

export function UrduFontLoader() {
  useEffect(() => {
    // Check if links already exist
    const existingPreconnect1 = document.querySelector('link[href="https://fonts.googleapis.com"]')
    const existingPreconnect2 = document.querySelector('link[href="https://fonts.gstatic.com"]')
    const existingFontLink = document.querySelector('link[href*="Noto+Nastaliq+Urdu"]')

    if (!existingPreconnect1) {
      const preconnect1 = document.createElement("link")
      preconnect1.rel = "preconnect"
      preconnect1.href = "https://fonts.googleapis.com"
      document.head.appendChild(preconnect1)
    }

    if (!existingPreconnect2) {
      const preconnect2 = document.createElement("link")
      preconnect2.rel = "preconnect"
      preconnect2.href = "https://fonts.gstatic.com"
      preconnect2.crossOrigin = "anonymous"
      document.head.appendChild(preconnect2)
    }

    if (!existingFontLink) {
      const fontLink = document.createElement("link")
      fontLink.href = "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
      fontLink.rel = "stylesheet"
      document.head.appendChild(fontLink)
    }
  }, [])

  return null
}

