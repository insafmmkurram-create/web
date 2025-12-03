import { Card, CardContent } from "@/components/ui/card"

export function EldersMessageSection() {
  return (
    <section id="elders-message" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            Message from <span className="text-amber-800">Khawajak Community Elders</span>
          </h2>
          
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8 px-6 md:px-10 lg:px-12">
              <div className="text-gray-700 leading-relaxed space-y-6 text-base md:text-lg">
                <p>
                  As elders and representatives of the Khawajak community, we are proud to witness the responsible development of our region's mineral resources through Insaf Mining & Minerals Private Limited. For over two decades, Malik Sajjad Amin and his team have worked in close partnership with our community, respecting our traditions, agreements, and collective interests.
                </p>
                
                <p>
                  We value the company's commitment to transparency, fairness, and the welfare of both the community and workers. Through collaboration, ethical practices, and shared responsibility, this partnership ensures that the benefits of our region's resources are enjoyed by all, while fostering development, safety, and prosperity.
                </p>
                
                <p>
                  We encourage continued cooperation and support for initiatives that protect our heritage, empower our people, and create sustainable opportunities for future generations.
                </p>
                
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <p className="font-semibold text-gray-900">— Community Elders, Khawajak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

