import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import ToolWorkspace from "@/components/ToolWorkspace";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background/80">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Features />
      <ToolWorkspace />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
