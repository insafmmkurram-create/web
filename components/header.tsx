"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ChevronRight } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#about-us", label: "About" },
    { href: "#founders-message", label: "Founder" },
    { href: "#vision", label: "Vision" },
    { href: "#sustainability", label: "Sustainability" },
    { href: "#projects", label: "Projects" },
  ]

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-amber-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-amber-500/30 group-hover:ring-amber-400 transition-all duration-300">
              <Image
                src="/insaf/logo.jpg"
                alt="INSAF Mining and Mineral Logo"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white text-lg tracking-wider">INSAF</span>
              <span className="block text-amber-400/80 text-[10px] tracking-[0.2em] uppercase font-medium">
                Mining & Minerals
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/media"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Media
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
            >
              Contact Us
              <ChevronRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-300 hover:text-amber-400 transition-colors p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pb-6 space-y-1 border-t border-white/10 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 px-4">
              <Link
                href="/media"
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Media
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                Contact Us
                <ChevronRight size={14} />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
