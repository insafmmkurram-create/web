import Image from "next/image"
import { Quote } from "lucide-react"

export function FoundersMessageSection() {
  return (
    <section id="founders-message" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Leadership
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
            Founder&apos;s <span className="text-gold-gradient">Message</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Founder Image */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-400/30 to-amber-600/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-72 md:w-80 aspect-[3/4] rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-amber-500/30 transition-all duration-500 shadow-2xl">
                <Image
                  src="/founder.JPG"
                  alt="Malik Sajjad Amin, Founder and Owner"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 288px, 320px"
                />
              </div>
              {/* Name plate */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-6 py-3 rounded-full shadow-lg shadow-amber-500/20 whitespace-nowrap">
                <p className="font-bold text-sm">Malik Sajjad Amin</p>
                <p className="text-[10px] text-slate-800 text-center">Founder & Owner</p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 md:p-10 lg:p-12">
              <Quote size={48} className="text-amber-500/20 absolute top-6 left-6" />

              <div className="relative z-10 text-gray-300 leading-relaxed space-y-5 text-base md:text-lg">
                <p className="text-xl md:text-2xl font-semibold text-white leading-snug">
                  Greetings!
                </p>

                <p>
                  I am Malik Sajjad Amin, Founder and Owner of Insaf Mining & Minerals Private
                  Limited, and I am delighted to welcome you to our company&apos;s website. Since
                  2004, we have been working in the mining sector through partnerships and
                  agreements with the Khawajak community, always prioritizing transparency,
                  fairness, and the best interests of the community at every step.
                </p>

                <p className="text-gray-400">
                  Our company places the development of the region, the welfare of workers, and
                  collaboration with the local community at the forefront of our mission. With 21
                  years of experience and dedicated effort, we are advancing the community&apos;s
                  resources through modern machinery, safe working environments, and transparent
                  agreements.
                </p>

                <p className="text-gray-400">
                  Our goal is to ensure that minerals do not remain the property of a few, but
                  that every member of the community has their rightful share and a secure future.
                  Through our company, we aim not only to manage minerals safely and profitably
                  but also to contribute to the growth of the local economy and community development.
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />
                  <div>
                    <p className="font-bold text-white">Malik Sajjad Amin</p>
                    <p className="text-amber-400/70 text-sm">
                      Founder & Owner, Insaf Mining & Minerals Pvt. Ltd.
                    </p>
                  </div>
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
