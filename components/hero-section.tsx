"use client"

import { useState, useEffect } from "react"
import { Download, ArrowDown, Gem, Mountain, Shield } from "lucide-react"

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
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const stats = [
    { icon: Mountain, value: "20+", label: "Years Experience" },
    { icon: Gem, value: "9", label: "Active Sites" },
    { icon: Shield, value: "100%", label: "Community Owned" },
  ]

  return (
    <>
      {/* Download ticker */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 overflow-hidden shadow-lg">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="ticker-track font-semibold text-xs uppercase tracking-wider">
            {[0, 1].map((item) => (
              <a
                key={item}
                href={downloadUrl}
                download
                className="mr-12 inline-flex items-center gap-2 hover:text-slate-700 transition-colors"
                aria-label="Download the Insaf mobile application APK"
              >
                <Download size={14} />
                {tickerMessage}
                <span className="underline font-bold">Click here</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background images */}
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90" />
            </div>
          ))}
        </div>

        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                  Since 2004
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                Re-Imagining
                <br />
                <span className="text-gold-gradient">Mining in</span>
                <br />
                Pakistan
              </h1>

              <p className="text-lg text-gray-400 max-w-lg leading-relaxed mb-10">
                Transforming Pakistan&apos;s mineral resources through sustainable, transparent,
                and community-driven mining practices in the Kurram region.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#about-us"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 text-sm tracking-wide"
                >
                  Discover More
                  <ArrowDown size={16} />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-amber-500/50 text-white hover:text-amber-400 px-8 py-4 rounded-full font-semibold transition-all duration-300 text-sm tracking-wide hover:bg-white/5"
                >
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Right Content - Mineral showcase */}
            <div className="animate-fade-in-right delay-300 hidden lg:block">
              <div className="relative">
                <div className="glass rounded-2xl p-6 animate-pulse-glow">
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img
                      src="/c1.jpg"
                      alt="Mineral Specimen"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Gem size={16} className="text-amber-400" />
                      <h3 className="text-white font-bold text-lg">Premium Minerals</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      High-quality emeralds, gold, copper, rubies, aquamarine, and marble
                      from the rich mineral deposits of Pakistan.
                    </p>
                    <div className="flex gap-2 pt-2">
                      {["Gold", "Emerald", "Ruby", "Marble"].map((mineral) => (
                        <span
                          key={mineral}
                          className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/70 bg-amber-400/10 px-2.5 py-1 rounded-full"
                        >
                          {mineral}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 lg:mt-24 grid grid-cols-3 gap-6 max-w-2xl">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center lg:text-left animate-fade-in-up"
                style={{ animationDelay: `${0.5 + index * 0.15}s` }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <stat.icon size={20} className="text-amber-400" />
                  <span className="text-3xl font-black text-white">{stat.value}</span>
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentImageIndex
                  ? "w-8 bg-amber-400"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}
