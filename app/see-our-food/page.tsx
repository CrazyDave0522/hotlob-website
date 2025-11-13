// app/see-our-food/page.tsx
import Hero from "./components/hero";
import FoodSection from "./components/food-section";
import { supabase } from "@/lib/supabaseClient";
import { CONSTANTS } from "@/lib/constants";
import type { Dish, RawDish } from "@/types/types";

export const revalidate = CONSTANTS.REVALIDATE_TIME; // ISR: revalidate data

export default async function SeeOurFoodPage() {
  /* ========== Fetch tags and dishes (with images/tags) in parallel ========== */
  const [
    { data: tags, error: tagError },
    { data: dishesRaw, error: dishError },
  ] = await Promise.all([
    supabase
      .from("tag")
      .select("id, name, icon_url, icon_url_active")
      .order("name"),
    supabase
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
      .order("created_at", { ascending: false }),
  ]);

  if (tagError) console.error("❌ Failed to fetch tags:", tagError);
  if (dishError) {
    console.error("❌ Failed to fetch dishes (with media/tags):", dishError);
    console.log("dishesRaw", dishesRaw);
  }

  /* ========== Integrate data ========== */
  const dishes: Dish[] = ((dishesRaw as RawDish[] | null) ?? [])
    .map((d) => {
      const imageUrl =
        d.media_asset?.[0]?.image_url ?? CONSTANTS.DEFAULT_DISH_IMAGE;
      const matchedTags =
        d.dish_tag?.flatMap((dt) => dt.tag ?? [])?.filter(Boolean) ?? [];

      // Organize available stores
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

  // Only show tags actually used by currently displayable dishes
  const activeTagIds = new Set<string>();
  for (const d of dishes) {
    for (const t of d.tags) activeTagIds.add(t.id);
  }
  const filteredTags = (tags ?? []).filter((t) => activeTagIds.has(t.id));

  /* ========== Render page ========== */
  return (
    <>
      <Hero
        title="See Our Food"
        description={"“You have to try their lobster rolls — they’re addictive. And their other rolls are so good, I want to go back for more.”\n— Google Review ⭐⭐⭐⭐⭐"}
        imageUrl="/images/see-our-food-hero.jpg"
        size="medium"
        footerNote="Our menu is subject to availability and seasons."
      />
      {/* Disclaimer moved inside Hero via footerNote prop */}
      {/* Pass filtered tags based on active dishes to FoodSection */}
  <FoodSection tags={filteredTags} dishes={dishes} />
    </>
  );
}
