import { Card, CardContent } from "@/components/ui/card"

export function AboutUsSection() {
  return (
    <section id="about-us" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            <span className="text-amber-800">About</span> Us
          </h2>
          
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8 px-6 md:px-10 lg:px-12">
              <div className="text-gray-700 leading-relaxed space-y-6 text-base md:text-lg text-justify">
                <p>
                  Insaf Mining & Minerals Private Limited is a pioneering mining company operating in the Kurram region, dedicated to responsible and transparent mineral development. Since 2004, our founder, Malik Sajjad Amin, has worked closely with the Khawajak community to establish long-term agreements that ensure fairness, community participation, and sustainable growth.
                </p>
                
                <p>
                  Over the years, we have developed extensive mining operations, built infrastructure, and introduced modern machinery while prioritizing the welfare of our workers and the local community. Our projects are guided by a strong commitment to transparency, equitable resource sharing, and adherence to community agreements, ensuring that the benefits of mineral resources are shared fairly among all stakeholders.
                </p>
                
                <p>
                  Despite challenges including natural setbacks, security threats, and community disagreements, our company has remained steadfast in its mission to responsibly develop the region's mineral wealth. We continue to innovate, expand, and create systems that empower local communities, protect resources, and ensure sustainable development for future generations.
                </p>
                
                <p>
                  At Insaf Mining & Minerals, we believe that mineral resources are a collective asset. Our vision is to create a model of mining that balances profitability, community empowerment, and environmental responsibility, setting an example for ethical mining practices in the region.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

