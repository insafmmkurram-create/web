import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function Media() {
  const images = [
    { src: "/insaf/s1.jpeg", alt: "INSAF Mining Operations 1" },
    { src: "/insaf/s2.jpeg", alt: "INSAF Mining Operations 2" },
    { src: "/insaf/s3.jpeg", alt: "INSAF Mining Operations 3" },
    { src: "/insaf/s4.jpeg", alt: "INSAF Mining Operations 4" },
    { src: "/insaf/s5.jpeg", alt: "INSAF Mining Operations 5" },
    { src: "/insaf/s6.jpeg", alt: "INSAF Mining Operations 6" },
    { src: "/insaf/s7.jpeg", alt: "INSAF Mining Operations 7" },
    { src: "/insaf/s8.jpeg", alt: "INSAF Mining Operations 8" },
    { src: "/insaf/s9.jpeg", alt: "INSAF Mining Operations 9" },
  ]

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <section className="pt-28 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Gallery
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Media <span className="text-gold-gradient">Gallery</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-6" />
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Explore our mining operations, projects, and community initiatives through our photo gallery.
            </p>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    Site {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
