import Hero from "@/components/layout/Hero";
import { NewsList } from "@/components/news/NewsList";

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

