// app/see-our-food/page.tsx
import Hero from "./components/hero";
import FoodSection from "./components/food-section";
import { supabase } from "@/lib/supabaseClient";
import { CONSTANTS } from "@/lib/constants";
import type { Dish, RawDish, AllergenTag, CategoryOption } from "@/types/types";

export const revalidate = CONSTANTS.REVALIDATE_TIME; // ISR: revalidate data

export default async function SeeOurFoodPage() {
  /* ========== Fetch allergen tags and dishes (with images/allergens/categories) in parallel ========== */
  const [
    { data: allergenTags, error: tagError },
    { data: dishesRaw, error: dishError },
  ] = await Promise.all([
    supabase
      .from("allergen_tag")
      .select("id, name, icon_url, icon_url_active")
      .order("name"),
    supabase
      .from("dish")
      .select(
        `
        id, name, description, tier, is_visible, is_available, category, created_at,
        media_asset ( image_url ),
        dish_allergen ( allergen_tag ( id, icon_url, icon_url_active ) ),
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

  if (tagError) console.error("❌ Failed to fetch allergen tags:", tagError);
  if (dishError) {
    console.error("❌ Failed to fetch dishes (with media/allergens):", dishError);
    console.log("dishesRaw", dishesRaw);
  }

  // Type assertion for allergenTags
  const typedAllergenTags: AllergenTag[] = allergenTags || [];

  /* ========== Integrate data ========== */
  const dishes: Dish[] = ((dishesRaw as RawDish[] | null) ?? [])
    .map((d) => {
      const imageUrl =
        d.media_asset?.[0]?.image_url ?? CONSTANTS.DEFAULT_DISH_IMAGE;
      const matchedAllergens =
        d.dish_allergen?.flatMap((da) => da.allergen_tag ?? [])?.filter(Boolean) ?? [];

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
        allergens: matchedAllergens,
        category: d.category,
        orderUrl: CONSTANTS.ORDER_URL,
        stores,
      };
    })
    .filter((d) => (d.stores?.length ?? 0) > 0);

  // Only show allergen tags actually used by currently displayable dishes
  const activeAllergenIds = new Set<string>();
  for (const d of dishes) {
    for (const a of d.allergens) activeAllergenIds.add(a.id);
  }
  const filteredAllergenTags = (typedAllergenTags ?? []).filter((t) => activeAllergenIds.has(t.id));

  // Define category options
  const categoryOptions: CategoryOption[] = [
    { id: 'seafood', name: 'Seafood', icon_url: '/images/icons/food-category/fish.svg', icon_url_active: '/images/icons/food-category/fish-active.svg' },
    { id: 'meat', name: 'Meat', icon_url: '/images/icons/food-category/meat.svg', icon_url_active: '/images/icons/food-category/meat-active.svg' },
    { id: 'vegetarian', name: 'Vegetarian', icon_url: '/images/icons/food-category/vegetarian.svg', icon_url_active: '/images/icons/food-category/vegetarian-active.svg' },
    { id: 'dessert', name: 'Dessert', icon_url: '/images/icons/food-category/desert.svg', icon_url_active: '/images/icons/food-category/desert-active.svg' },
  ];

  /* ========== Render page ========== */
  return (
    <>
      <Hero
        title="See Our Food"
        description={
          "“You have to try their lobster rolls — they’re addictive. And their other rolls are so good, I want to go back for more.”\n— Google Review ⭐⭐⭐⭐⭐"
        }
        imageUrl="/images/see-our-food-hero.jpg"
        size="medium"
        footerNote="Our menu is subject to availability and seasons."
      />
      {/* Pass filtered allergen tags and category options to FoodSection */}
      <FoodSection allergenTags={filteredAllergenTags} categoryOptions={categoryOptions} dishes={dishes} />
    </>
  );
}
