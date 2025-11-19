import Hero from "./see-our-food/components/hero";
import AboutHotlob from "./components/AboutHotlob";
import SeeOurFoodSection from "./components/SeeOurFoodSection";
import CateringSection from "./components/CateringSection";
import { supabase } from "@/lib/supabaseClient";
import { CONSTANTS } from "@/lib/constants";
import type { Dish, RawDish } from "@/types/types";
import Image from "next/image";

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
      {/* More homepage modules to follow... */}
    </main>
  );
}
