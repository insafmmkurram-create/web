import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function FoundersMessageSection() {
  return (
    <section id="founders-message" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            <span className="text-amber-800">Founder's</span> Message
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Founder Image */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/founder.jpeg"
                  alt="Malik Sajjad Amin, Founder and Owner"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            
            {/* Message Content */}
            <div className="md:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="pt-8 pb-8 px-6 md:px-10 lg:px-12">
                  <div className="text-gray-700 leading-relaxed space-y-6 text-base md:text-lg">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Greetings!</h3>
                    </div>
                    
                    <p>
                      I am Malik Sajjad Amin, Founder and Owner of Insaf Mining & Minerals Private Limited, and I am delighted to welcome you to our company's website. Since 2004, we have been working in the mining sector through partnerships and agreements with the Khawajak community, always prioritizing transparency, fairness, and the best interests of the community at every step.
                    </p>
                    
                    <p>
                      Our company places the development of the region, the welfare of workers, and collaboration with the local community at the forefront of our mission. With 21 years of experience and dedicated effort, we are advancing the community's resources through modern machinery, safe working environments, and transparent agreements.
                    </p>
                    
                    <p>
                      Our goal is to ensure that minerals do not remain the property of a few, but that every member of the community has their rightful share and a secure future. We strive to ensure that every individual can see and understand their contributions, resources, and projects, making this system an example for the region.
                    </p>
                    
                    <p>
                      Through our company, we aim not only to manage minerals safely and profitably but also to contribute to the growth of the local economy and community development.
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-gray-300">
                      <p className="font-semibold text-gray-900 mb-1">— Malik Sajjad Amin</p>
                      <p className="text-gray-600 text-sm">Founder & Owner, Insaf Mining & Minerals Private Limited</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

