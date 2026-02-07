import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero
        variant="tall"
        bgImage="/images/hero-bg/home-hero.jpg"
        title="Get Rollin' with us !"
        subtitle="Premium Aussie lobster rolls — plus prawn, crab, meat & vegetarian favorites, all packed in buttery brioche."
        overlay={true}
      />
    </main>
  );
}

