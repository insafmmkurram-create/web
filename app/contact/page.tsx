import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <div className="flex-1 pt-28">
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
                Reach Out
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Contact <span className="text-gold-gradient">Us</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Office Address</h3>
                      <p className="text-gray-400 text-sm">Near Azam Hospital, Upper Sateen, Lower Kurram, KPK</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <a href="mailto:insafmmkurram@gmail.com" className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                        insafmmkurram@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Phone</h3>
                      <a href="tel:+923009591990" className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                        +92 30 09591990
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
                      placeholder="Write your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 text-sm tracking-wide"
                  >
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
