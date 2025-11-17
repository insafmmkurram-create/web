import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutUsSection } from "@/components/about-us-section"
import { FoundersMessageSection } from "@/components/founders-message-section"
import { VisionSection } from "@/components/vision-section"
import { EldersMessageSection } from "@/components/elders-message-section"
import { ProductsSection } from "@/components/products-section"
import { SustainabilitySection } from "@/components/sustainability-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutUsSection />
      <FoundersMessageSection />
      <VisionSection />
      <EldersMessageSection />
      <ProductsSection />
      <SustainabilitySection />
      <Footer />
    </main>
  )
}
