import Hero from "@/components/Hero";

export default function SeeOurFoodPage() {
  return (
    <main>
      <Hero
        variant="short"
        bgImage="/images/hero-bg/see-our-food-hero.jpg"
        title="See Our Food"
        subtitle={`You have to try their lobster rolls — they're addictive. And their other rolls are so good, I want to go back for more.\n— Google Review ⭐⭐⭐⭐⭐`}
        overlay={true}
      />
    </main>
  );
}

