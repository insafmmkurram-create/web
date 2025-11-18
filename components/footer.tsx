import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-12 w-12">
                <Image
                  src="/insaf/logo.jpg"
                  alt="INSAF Mining and Mineral Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <span className="font-bold text-white">INSAF</span>
            </div>
            <p className="text-sm text-gray-400">
              Reimagining mineral mining in Pakistan with sustainable practices and expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="hover:text-amber-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-amber-400 transition">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#sustainability" className="hover:text-amber-400 transition">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#careers" className="hover:text-amber-400 transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                Email:{" "}
                <a href="mailto:info@insafmining.pk" className="hover:text-amber-400 transition">
                  insafmmkurram@gmail.com
                </a>
              </li>
              <li>Phone: +92 30 09591990</li>
              <li>Office Address: Near Azam hospital Upper Sateen Lower Kurram KPK</li>
              <li>Project Site Office: Arwaza Central Kurram KPK</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 INSAF Mineral Mining Company. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-400 transition">
                Facebook
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-amber-400 transition">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
