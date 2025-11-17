export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="order-2 md:order-1">
            <img
              src="/mining-company-building.jpg"
              alt="INSAF Mineral Mining Company"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-amber-800">INSAF</span>
              <br />
              MINERAL
              <br />
              COMPANY
              <br />
              <span className="text-lg font-normal text-gray-600">(IMC)</span>
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Established as a premier mineral exploration and mining company in Pakistan, INSAF Mineral Company brings
              decades of expertise in the extraction and development of precious and semi-precious minerals.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Since our establishment, INSAF has been instrumental in the development and mining of gold, copper,
              rubies, and exploration of aquamarine and marble. We combine geological expertise with sustainable
              practices to unlock Pakistan's mineral wealth responsibly.
            </p>

            <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition">
              Read More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
