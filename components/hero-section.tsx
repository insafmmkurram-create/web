"use client"

import { useState, useEffect } from "react"

export function HeroSection() {
  const images = [
    "/insaf/s1.jpeg",
    "/insaf/s2.jpeg",
    "/insaf/s3.jpeg",
    "/insaf/s4.jpeg",
    "/insaf/s5.jpeg",
    "/insaf/s6.jpeg",
    "/insaf/s7.jpeg",
    "/insaf/s8.jpeg",
    "/insaf/s9.jpeg",
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const downloadUrl = "/app.apk"
  const tickerMessage = "Download the Insaf mobile app — tap to install"

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <>
      {/* Download ticker (always on top, above hero image/content) */}
      <div className="w-full bg-amber-400 text-black overflow-hidden shadow-lg">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="ticker-track font-semibold text-sm uppercase tracking-wide">
            {[0, 1].map((item) => (
              <a
                key={item}
                href={downloadUrl}
                download
                className="mr-8 inline-flex items-center gap-2 hover:text-black/70 transition-colors"
                aria-label="Download the Insaf mobile application APK"
              >
                <span>📱</span>
                {tickerMessage}
                <span className="underline">Click here</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

      {/* Background Images with fade transition */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              RE-IMAGINING
              <br />
              <span className="text-amber-400">MINING IN</span>
              <br />
              PAKISTAN
            </h1>
            <p className="text-lg text-gray-100 max-w-md leading-relaxed">
              Transforming Pakistan's mineral resources through sustainable and responsible mining practices.
            </p>
          </div>

          {/* Right Content - Mineral showcase */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-lg overflow-hidden">
                <img src="/c1.jpg" alt="Mineral Specimen" className="w-full h-48 object-cover" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h3 className="text-white font-bold text-sm mb-2">Emerald</h3>
                <p className="text-gray-200 text-xs leading-relaxed">
                  High-quality emeralds from the emerald mines of Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
