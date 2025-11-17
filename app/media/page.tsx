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
    <main className="min-h-screen">
      <Header />
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-amber-800 font-semibold mb-2">/ MEDIA</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Media
              <br />
              Gallery
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl">
              Explore our mining operations, projects, and community initiatives through our photo gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

