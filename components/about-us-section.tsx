"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Calendar, Pickaxe, Handshake } from "lucide-react"

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const duration = 2000
          const steps = 60
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-gold-gradient">
      {count}
      {suffix}
    </div>
  )
}

export function AboutUsSection() {
  const stats = [
    { icon: Calendar, value: 20, suffix: "+", label: "Years of Operation" },
    { icon: Pickaxe, value: 9, suffix: "", label: "Mining Sites" },
    { icon: Users, value: 500, suffix: "+", label: "Community Members" },
    { icon: Handshake, value: 100, suffix: "%", label: "Transparent Agreements" },
  ]

  return (
    <section id="about-us" className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Who We Are
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            About <span className="text-gold-gradient">INSAF</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text content */}
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed text-lg">
              Insaf Mining & Minerals Private Limited is a pioneering mining company operating
              in the Kurram region, dedicated to responsible and transparent mineral development.
              Since 2004, our founder, Malik Sajjad Amin, has worked closely with the Khawajak
              community to establish long-term agreements that ensure fairness, community
              participation, and sustainable growth.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Over the years, we have developed extensive mining operations, built infrastructure,
              and introduced modern machinery while prioritizing the welfare of our workers and
              the local community. Our projects are guided by a strong commitment to transparency,
              equitable resource sharing, and adherence to community agreements.
            </p>
            <p className="text-gray-400 leading-relaxed">
              At Insaf Mining & Minerals, we believe that mineral resources are a collective asset.
              Our vision is to create a model of mining that balances profitability, community
              empowerment, and environmental responsibility.
            </p>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                <img
                  src="/insaf/s1.jpeg"
                  alt="Mining operations"
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                <img
                  src="/insaf/s3.jpeg"
                  alt="Mining site"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                <img
                  src="/insaf/s2.jpeg"
                  alt="Mining equipment"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                <img
                  src="/insaf/s4.jpeg"
                  alt="Community partnership"
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 transition-all duration-500 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={22} />
              </div>
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="text-gray-500 text-sm font-medium mt-2 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
