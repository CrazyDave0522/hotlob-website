import Hero from "@/components/Hero";
import { ExpandableCardGrid } from "@/components/ExpandableCardGrid";
import { DishCardGrid } from "@/components/DishCardGrid";
import { MoreButton } from "@/components/MoreButton";
import { SectionTitle } from "@/components/SectionTitle";
import { NewsCarousel } from "@/components/NewsCarousel";
import { fetchNewsListItems } from "@/lib/news";

export default async function Home() {
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

  // Fetch up to 5 recent published news items
  const newsItems = await fetchNewsListItems(5);

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
      <section className="bg-[url('/images/section-bg/home-bg-see-our-food-mb.png')] md:bg-[url('/images/section-bg/home-bg-see-our-food.png')] bg-cover bg-center bg-no-repeat">
        <SectionTitle text="See Our Food" />
        <DishCardGrid limit={4} />
        <div className="flex justify-center pt-7.5">
          <MoreButton href="/see-our-food" />
        </div>
      </section>
      <section className="news-section">
        <SectionTitle text="Hot News" />
        <NewsCarousel news={newsItems} />
      </section>
    </main>
  );
}
