import { Target, Globe, Lightbulb, TreePine } from "lucide-react"

export function VisionSection() {
  const pillars = [
    {
      icon: Target,
      title: "Responsible Mining",
      description:
        "Leading the way in transparent, fair, and sustainable mineral resource management.",
    },
    {
      icon: Globe,
      title: "Community First",
      description:
        "Every individual has a rightful share in the region's resources and a secure future.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Modern technology and ethical practices setting a benchmark in the mining industry.",
    },
    {
      icon: TreePine,
      title: "Sustainability",
      description:
        "Balancing profitability with social responsibility and environmental stewardship.",
    },
  ]

  return (
    <section id="vision" className="relative py-24 md:py-32 overflow-hidden">
      {/* Dark gradient background with accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,164,6,0.08),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Our Purpose
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            Our <span className="text-gold-gradient">Vision</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-8" />
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Our vision at Insaf Mining & Minerals is to be a leader in responsible and sustainable
            mining, where mineral resources are managed transparently, fairly, and for the benefit
            of the entire community.
          </p>
        </div>

        {/* Vision pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <pillar.icon size={26} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{pillar.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl md:text-2xl text-gray-300 font-light italic max-w-3xl mx-auto leading-relaxed">
            &ldquo;Through innovation, modern technology, and ethical practices, we aim to set a
            benchmark for mining that balances profitability with social responsibility.&rdquo;
          </blockquote>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
