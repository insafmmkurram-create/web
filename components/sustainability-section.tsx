export function SustainabilitySection() {
  return (
    <section id="sustainability" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sustainable
              <br />
              Mining
              <br />
              Practices
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              INSAF is committed to responsible mining that balances economic development with environmental protection
              and community welfare.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-amber-800 font-bold">→</span>
                <span className="text-gray-700">Environmental stewardship and reclamation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-800 font-bold">→</span>
                <span className="text-gray-700">Community engagement and development</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-800 font-bold">→</span>
                <span className="text-gray-700">Safe and ethical mining standards</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-800 font-bold">→</span>
                <span className="text-gray-700">Cutting-edge technology and practices</span>
              </li>
            </ul>

            <button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 rounded-lg font-medium transition">
              Learn More
            </button>
          </div>

          {/* Image */}
          <div>
            <img src="/sustainable-mining-landscape.jpg" alt="Sustainable Mining" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
