import { Leaf, Users, ShieldCheck, Cpu, ArrowRight } from "lucide-react"

export function SustainabilitySection() {
  const practices = [
    {
      icon: Leaf,
      title: "Environmental Stewardship",
      description: "Land reclamation, water management, and ecosystem preservation at every site.",
    },
    {
      icon: Users,
      title: "Community Development",
      description: "Fair profit sharing and direct investment in local infrastructure and education.",
    },
    {
      icon: ShieldCheck,
      title: "Ethical Standards",
      description: "Safe working conditions, fair wages, and compliance with mining regulations.",
    },
    {
      icon: Cpu,
      title: "Modern Technology",
      description: "Cutting-edge equipment minimizing environmental impact while maximizing efficiency.",
    },
  ]

  return (
    <section id="sustainability" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Our Commitment
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Sustainable
              <br />
              <span className="text-gold-gradient">Mining</span>
              <br />
              Practices
            </h2>

            <p className="text-gray-400 leading-relaxed mb-10 max-w-lg">
              INSAF is committed to responsible mining that balances economic development with
              environmental protection and community welfare. Every decision we make considers
              its impact on future generations.
            </p>

            {/* Practices grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {practices.map((practice, index) => (
                <div
                  key={index}
                  className="group flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    <practice.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{practice.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{practice.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 text-sm tracking-wide"
            >
              Learn More
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Image grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                  <img
                    src="/insaf/s5.jpeg"
                    alt="Sustainable Mining"
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                  <img
                    src="/insaf/s7.jpeg"
                    alt="Mining Operations"
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                  <img
                    src="/insaf/s6.jpeg"
                    alt="Community Partnership"
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/30 transition-all duration-500">
                  <img
                    src="/insaf/s8.jpeg"
                    alt="Environmental Protection"
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl shadow-xl shadow-amber-500/20">
              <p className="text-3xl font-black">100%</p>
              <p className="text-xs font-semibold opacity-80">Community Focused</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
