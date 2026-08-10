import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SplitBanner from "@/components/SplitBanner";
import ValueProps from "@/components/ValueProps";
import ProductGrid from "@/components/ProductGrid";
import Lookbook from "@/components/Lookbook";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CustomCursor />
      <Header />
      <Hero />
      <SplitBanner />
      <ValueProps />
      <ProductGrid />
      <Lookbook />
      <Newsletter />
      <Footer />
    </main>
  );
}
