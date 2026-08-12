import { BrandValues } from "@/components/yugen/BrandValues";
import { CollectionFeature } from "@/components/yugen/CollectionFeature";
import { Footer } from "@/components/yugen/Footer";
import { Header } from "@/components/yugen/Header";
import { Hero } from "@/components/yugen/Hero";
import { Lookbook } from "@/components/yugen/Lookbook";
import { NewInSection } from "@/components/yugen/NewInSection";
import { Newsletter } from "@/components/yugen/Newsletter";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CollectionFeature
          eyebrow="Women Collection"
          title={
            <>
              Grace in
              <br />
              Every Thread
            </>
          }
          cta="Explore Women"
          image="/assets/grace in every thread.png"
          imageAlt="Woman in a flowing dress walking in sand"
          variant="women"
          href="/women"
        />
        <CollectionFeature
          eyebrow="Men Collection"
          title={
            <>
              Effortless Style,
              <br />
              Every Day
            </>
          }
          cta="Explore Men"
          image="/assets/explore men collection.png"
          imageAlt="Man in a dark short-sleeve shirt and white trousers"
          variant="men"
          href="/men"
        />
        <BrandValues />
        <NewInSection />
        <Lookbook />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

