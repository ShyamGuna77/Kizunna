

"use client"



import Hero from "@/components/Hero"
import Connection from "@/components/Connection";
import HowitWorks from "@/components/HowItWorks";
import Feauterdcards from "@/components/Feauterdcards";
import Pricing from "@/components/Pricing";
import AppFeauters from "@/components/AppFeautures";
import TestimonialSection from "@/components/Testimonals";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div>
        <div className="bg-pink-100">
          <Hero />
          <Connection />
          <Feauterdcards />
          <HowitWorks />
          <Pricing />
          <AppFeauters />
          <TestimonialSection />
          <Footer />
        </div>
      </div>
    </>
  );
}
