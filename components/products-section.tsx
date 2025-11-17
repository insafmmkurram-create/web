export function ProductsSection() {
  const projects = [
    // {
    //   name: "Dassu Aquamarine El Prospect",
    //   category: "PROJECTS",
    //   description:
    //     "Raw samples of gemstones, cut and polished to attract the market. Efforts are ongoing to initiate mining activities.",
    //   image: "/aquamarine-crystal-gemstone.jpg",
    // },
    // {
    //   name: "Hunza Ruby Mining",
    //   category: "PROJECTS",
    //   description: "High-quality ruby extraction from the marble beds of the South Karakoram metamorphic complex.",
    //   image: "/ruby-mining-operation.jpg",
    // },
    // {
    //   name: "Gold Exploration",
    //   category: "PROJECTS",
    //   description: "Advanced exploration and extraction of gold deposits with modern geological techniques.",
    //   image: "/gold-ore-mining.jpg",
    // },
    {
      name: "INSAF Mining Operations - Site 1",
      category: "PROJECTS",
      description: "Our mining operations showcasing modern equipment and sustainable practices in the Kurram region.",
      image: "/insaf/s1.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 2",
      category: "PROJECTS",
      description: "Advanced mining infrastructure and machinery deployed at our operational sites.",
      image: "/insaf/s2.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 3",
      category: "PROJECTS",
      description: "Community-focused mining operations ensuring fair resource distribution and worker welfare.",
      image: "/insaf/s3.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 4",
      category: "PROJECTS",
      description: "Sustainable mining practices and environmental stewardship in action.",
      image: "/insaf/s4.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 5",
      category: "PROJECTS",
      description: "Modern mining technology and equipment ensuring efficient and safe operations.",
      image: "/insaf/s5.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 6",
      category: "PROJECTS",
      description: "Our commitment to transparency and community partnership in mineral development.",
      image: "/insaf/s6.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 7",
      category: "PROJECTS",
      description: "Infrastructure development and operational excellence in the mining sector.",
      image: "/insaf/s7.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 8",
      category: "PROJECTS",
      description: "Responsible mineral extraction contributing to regional economic growth.",
      image: "/insaf/s8.jpeg",
    },
    {
      name: "INSAF Mining Operations - Site 9",
      category: "PROJECTS",
      description: "Long-term partnerships with local communities ensuring sustainable development.",
      image: "/insaf/s9.jpeg",
    },
  ]

  return (
    <section id="projects" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-amber-800 font-semibold mb-2">/ PROJECTS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            OUR
            <br />
            PRODUCTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              <div className="h-64 overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-amber-800 text-sm font-semibold mb-2">{project.category}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
