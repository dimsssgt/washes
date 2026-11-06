import Navbar from "@/components/landingpage/Navbar";
import Hero from "@/components/landingpage/Hero";
import Marquee from "@/components/landingpage/Marquee";
import Services from "@/components/landingpage/Services";
import Marquee1 from "@/components/landingpage/Marquee1";
import Pricing from "@/components/landingpage/Pricing";
import HowItWorks from "@/components/landingpage/HowItWorks";
import StatusAndHours from "@/components/landingpage/StatusAndHours";
import Testimonials from "@/components/landingpage/Testimonials";
import Faq from "@/components/landingpage/Faq";
import Footer from "@/components/landingpage/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Marquee1 />
        <Pricing />
        <HowItWorks />
        <StatusAndHours />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
