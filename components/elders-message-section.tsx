import { Quote, Shield } from "lucide-react"

export function EldersMessageSection() {
  return (
    <section id="elders-message" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Community Voice
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Message from the{" "}
            <span className="text-gold-gradient">Elders</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 md:p-12 lg:p-16">
            {/* Decorative icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield size={20} className="text-slate-950" />
            </div>

            <Quote size={60} className="text-amber-500/10 absolute top-8 right-8" />

            <div className="relative z-10 text-gray-300 leading-relaxed space-y-6 text-base md:text-lg">
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed italic">
                &ldquo;As elders and representatives of the Khawajak community, we are proud to
                witness the responsible development of our region&apos;s mineral resources through
                Insaf Mining & Minerals Private Limited.&rdquo;
              </p>

              <p className="text-gray-400">
                For over two decades, Malik Sajjad Amin and his team have worked in close
                partnership with our community, respecting our traditions, agreements, and
                collective interests.
              </p>

              <p className="text-gray-400">
                We value the company&apos;s commitment to transparency, fairness, and the welfare
                of both the community and workers. Through collaboration, ethical practices, and
                shared responsibility, this partnership ensures that the benefits of our region&apos;s
                resources are enjoyed by all, while fostering development, safety, and prosperity.
              </p>

              <p className="text-gray-400">
                We encourage continued cooperation and support for initiatives that protect our
                heritage, empower our people, and create sustainable opportunities for future
                generations.
              </p>

              <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border-2 border-slate-900 flex items-center justify-center"
                    >
                      <span className="text-amber-400 text-xs font-bold">E{i}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-white">Community Elders</p>
                  <p className="text-amber-400/70 text-sm">Khawajak Community, Kurram</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
