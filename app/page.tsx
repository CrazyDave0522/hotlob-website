import Hero from "@/components/Hero";
import { ExpandableCardGrid } from "@/components/ExpandableCardGrid";
import { SectionTitle } from "@/components/SectionTitle";

export default function Home() {
  const cardItems = [
    {
      title: "Our Story",
      description:
        "Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.",
    },
    {
      title: "A quick bite that feels like a treat",
      description:
        "Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche — the perfect grab-and-go roll that fits any craving or budget.",
    },
    {
      title: "🦞 The Hotlob Hits",
      description:
        "✨ Truffle & Cheese Lobster Roll\n✨ Lemon & Dill Lobster Roll\n✨ Soft Shell Crab Roll",
    },
  ];

  return (
    <main>
      <Hero
        variant="tall"
        bgImage="/images/hero-bg/home-hero.jpg"
        title="Get Rollin' with us !"
        subtitle="Premium Aussie lobster rolls — plus prawn, crab, meat & vegetarian favorites, all packed in buttery brioche."
        overlay={true}
      />
      <section className="bg-[url('/images/section-bg/home-bg-about-hotlob-mb.png')] md:bg-[url('/images/section-bg/home-bg-about-hotlob.png')] bg-cover bg-center bg-no-repeat">
        <SectionTitle text="About Hotlob" />
        <ExpandableCardGrid items={cardItems} />
      </section>
    </main>
  );
}

