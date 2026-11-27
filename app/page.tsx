import Navbar from "@/components/landingpage/Navbar";
import NavbarWrapper from "@/components/landingpage/NavbarWrapper";
import Hero from "@/components/landingpage/Hero";
import Baju from "@/components/landingpage/Baju";
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
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
      <main className="overflow-x-clip">
        <Hero />
        {/* <Baju /> */}
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
