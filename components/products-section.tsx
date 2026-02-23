import { ArrowUpRight } from "lucide-react"

export function ProductsSection() {
  const projects = [
    {
      name: "Mining Operations - Site 1",
      description: "Modern equipment and sustainable practices in the Kurram region.",
      image: "/insaf/s1.jpeg",
    },
    {
      name: "Mining Operations - Site 2",
      description: "Advanced mining infrastructure and machinery deployed at operational sites.",
      image: "/insaf/s2.jpeg",
    },
    {
      name: "Mining Operations - Site 3",
      description: "Community-focused mining ensuring fair resource distribution.",
      image: "/insaf/s3.jpeg",
    },
    {
      name: "Mining Operations - Site 4",
      description: "Sustainable mining practices and environmental stewardship in action.",
      image: "/insaf/s4.jpeg",
    },
    {
      name: "Mining Operations - Site 5",
      description: "Modern mining technology ensuring efficient and safe operations.",
      image: "/insaf/s5.jpeg",
    },
    {
      name: "Mining Operations - Site 6",
      description: "Transparency and community partnership in mineral development.",
      image: "/insaf/s6.jpeg",
    },
    {
      name: "Mining Operations - Site 7",
      description: "Infrastructure development and operational excellence.",
      image: "/insaf/s7.jpeg",
    },
    {
      name: "Mining Operations - Site 8",
      description: "Responsible mineral extraction contributing to regional growth.",
      image: "/insaf/s8.jpeg",
    },
    {
      name: "Mining Operations - Site 9",
      description: "Long-term partnerships ensuring sustainable development.",
      image: "/insaf/s9.jpeg",
    },
  ]

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Our Work
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
              Mining <span className="text-gold-gradient">Projects</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            Explore our active mining sites across the Kurram region, where we combine modern
            technology with community-driven practices.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.06] hover:border-amber-500/20 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500" />

                {/* Project number */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white text-xs font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-amber-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                      Project
                    </span>
                    <h3 className="text-white font-bold text-lg mt-1 group-hover:text-amber-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-500 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
