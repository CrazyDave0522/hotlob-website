import Hero from "@/components/Hero";
import StoreList from "@/components/StoreList";

export default function LocationsPage() {
  return (
    <main>
      <Hero
        variant="short"
        bgImage="/images/hero-bg/our-locations-hero.png"
        title="Find Hotlob near you"
        subtitle={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.\nGrab one on your lunch break, between uni lectures, or on your way home.`}
        overlay={true}
      />
      <section className="locations-stores-section">
        <StoreList />
      </section>
    </main>
  );
}
