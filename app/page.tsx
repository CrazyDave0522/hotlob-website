import Hero from "./see-our-food/components/hero";
import AboutHotlob from "./components/AboutHotlob";
import SeeOurFoodSection from "./components/SeeOurFoodSection";
import CateringSection from "./components/CateringSection";
import OurLocationsSection from "./components/OurLocationsSection";
import NewsSection from "./components/NewsSection";
import { supabase } from "@/lib/supabaseClient";
import { CONSTANTS } from "@/lib/constants";
import type { Dish, RawDish } from "@/types/types";
import Image from "next/image";
import { getStoresWithDetails } from "@/lib/getStores";
import { getReviews } from "@/lib/getReviews";
import { stripHtmlTags, getSmartExcerpt } from "@/lib/utils/stripHtml";

export const revalidate = CONSTANTS.REVALIDATE_TIME; // ISR: revalidate data

export default async function Home() {
  // Fetch dish data from database (reusing see-our-food page query logic)
  const { data: dishesRaw, error: dishError } = await supabase
    .from("dish")
    .select(
      `
      id, name, description, tier, is_visible, is_available, created_at,
      media_asset ( image_url ),
      dish_tag ( tag ( id, icon_url, icon_url_active ) ),
      dish_store!inner(
        available,
        uber_url,
        store:store_id(
          id,
          name,
          latitude,
          longitude
        )
      )
    `
    )
    .eq("is_visible", true)
    .eq("is_available", true)
    .eq("dish_store.available", true)
    .order("created_at", { ascending: false });

  if (dishError) {
    console.error("❌ Failed to fetch dishes for home page:", dishError);
  }

  // Data processing: consolidate dish information
  const dishes: Dish[] = ((dishesRaw as RawDish[] | null) ?? [])
    .map((d) => {
      const imageUrl =
        d.media_asset?.[0]?.image_url ?? CONSTANTS.DEFAULT_DISH_IMAGE;
      const matchedTags =
        d.dish_tag?.flatMap((dt) => dt.tag ?? [])?.filter(Boolean) ?? [];

      // Compile available stores
      const stores =
        d.dish_store
          ?.filter((ds) => ds.available && ds.store)
          .map((ds) => ({
            id: ds.store!.id,
            name: ds.store!.name,
            uber_url: ds.uber_url,
            latitude: ds.store!.latitude,
            longitude: ds.store!.longitude,
          })) ?? [];

      return {
        id: d.id,
        name: d.name,
        description: d.description,
        tier: d.tier,
        imageUrl,
        tags: matchedTags,
        orderUrl: CONSTANTS.ORDER_URL,
        stores,
      };
    })
    .filter((d) => (d.stores?.length ?? 0) > 0);

  // Fetch top 2 stores by rating for Our Locations section
  const topStores = await getStoresWithDetails({ limit: 2 });

  // Fetch top 4 reviews for Our Locations section
  const reviews = await getReviews(4);

  // Fetch top 6 news items for News section
  const { data: newsData } = await supabase
    .from("news")
    .select("id,title,slug,excerpt,content,cover_image_url,publish_date")
    .eq("is_published", true)
    .order("publish_date", { ascending: false })
    .limit(6);

  const newsItems =
    newsData?.map((news) => ({
      id: news.id,
      title: news.title,
      slug: news.slug,
      excerpt: news.excerpt || getSmartExcerpt(stripHtmlTags(news.content)),
      coverImageUrl: news.cover_image_url,
      publishDate: news.publish_date,
    })) ?? [];

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
      <AboutHotlob />
      <SeeOurFoodSection dishes={dishes} />
      {/* Curve background section */}
      <section className="relative w-full" style={{ display: 'block', backgroundColor: '#FDF7F0' }}>
        <Image
          src="/images/home-bg-curve.png"
          alt="Curve background"
          width={1920}
          height={109}
          className="w-full h-auto"
          priority
          style={{ aspectRatio: '1920/109', display: 'block' }}
        />
      </section>
      <CateringSection />
      <OurLocationsSection stores={topStores} reviews={reviews} />
      {newsItems.length > 0 && <NewsSection news={newsItems} />}
      {/* More homepage modules to follow... */}
    </main>
  );
}
