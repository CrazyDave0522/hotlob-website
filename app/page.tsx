import Hero from "./see-our-food/components/hero";

export default function Home() {
  return (
    <main>
      <Hero
        title="Roll with us"
        description={
          "Premium Aussie lobster rolls — plus prawn, crab, meat & vegetarian favorites, all packed in buttery brioche."
        }
        imageUrl="/images/home-hero.jpg"
        size="home"
        overlayUrl="/images/home-overlay.png"
        showOverlay={true}
      />
      {/* More homepage modules to follow... */}
    </main>
  );
}
