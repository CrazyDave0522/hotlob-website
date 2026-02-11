import Hero from "@/components/Hero";
import { NewsList } from "@/components/NewsList";

export default function HotlobNewsPage() {
  return (
    <main>
      <Hero
        variant="short"
        bgImage="/images/hero-bg/news-hero.png"
        mobileBgImage="/images/hero-bg/news-hero-mb.png"
        title="Hot News"
        subtitle="Check out our latest news and stay tuned"
        overlay={false}
      />
      <NewsList />
    </main>
  );
}

