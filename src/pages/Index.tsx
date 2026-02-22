import Navigation from "@/components/Navigation";
import SplineSceneThemed from "@/components/SplineSceneThemed";
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
      <div className="w-full mx-auto">
        <SplineSceneThemed />
        <HowItWorks />
        <Features />
        <ToolWorkspace />
        <Pricing />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
