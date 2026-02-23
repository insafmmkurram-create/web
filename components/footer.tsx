import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-gray-400 overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-amber-500/20">
                <Image
                  src="/insaf/logo.jpg"
                  alt="INSAF Mining and Mineral Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <span className="font-bold text-white text-lg tracking-wider">INSAF</span>
                <span className="block text-amber-400/60 text-[10px] tracking-[0.2em] uppercase">
                  Mining & Minerals Pvt. Ltd.
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              Reimagining mineral mining in Pakistan with sustainable, transparent, and
              community-driven practices since 2004.
            </p>
            <div className="flex gap-3">
              {["Facebook", "LinkedIn", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300 text-xs font-bold"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#about-us", label: "About Us" },
                { href: "#projects", label: "Projects" },
                { href: "#sustainability", label: "Sustainability" },
                { href: "#vision", label: "Our Vision" },
                { href: "/media", label: "Media" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <a
                  href="mailto:insafmmkurram@gmail.com"
                  className="text-sm hover:text-amber-400 transition-colors"
                >
                  insafmmkurram@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm">+92 30 09591990</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm">
                  Near Azam Hospital, Upper Sateen, Lower Kurram, KPK
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-sm">Arwaza, Central Kurram, KPK (Project Site Office)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} INSAF Mining & Minerals Pvt. Ltd. All rights
              reserved.
            </p>
            <p className="text-xs text-gray-600">
              Kurram, Khyber Pakhtunkhwa, Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
