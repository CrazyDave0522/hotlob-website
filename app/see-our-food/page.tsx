// app/see-our-food/page.tsx
import Hero from "./components/hero";
import FoodSection from "./components/food-section";
import LocationIndicator from "./components/location-indicator";
import { supabase } from "@/lib/supabaseClient";
import { CONSTANTS } from "@/lib/constants";
import type { Dish, RawDish } from "@/types/types";

export const revalidate = CONSTANTS.REVALIDATE_TIME; // ISR: 重新验证数据

export default async function SeeOurFoodPage() {
  /* ========== 拉取标签 和 菜品(含图片/标签) 并行 ========== */
  const [
    { data: tags, error: tagError },
    { data: dishesRaw, error: dishError }
  ] = await Promise.all([
    supabase
      .from("tag")
      .select("id, name, icon_url")
      .order("name"),
    supabase
      .from("dish")
      .select(`
        id, name, description, tier, is_visible, is_available, created_at,
        media_asset ( image_url ),
        dish_tag ( tag ( id, icon_url ) ),
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
      `)
      .eq("is_visible", true)
      .eq("is_available", true)
      .order("created_at", { ascending: false })
  ]);

  if (tagError) console.error("❌ 拉取 tags 失败:", tagError);
  if (dishError) {
    console.error("❌ 拉取 dish(含媒体/标签) 失败:", dishError);
    console.log('dishesRaw', dishesRaw);
  }

  /* ========== 整合数据 ========== */
  const dishes: Dish[] = (dishesRaw as RawDish[] | null)?.map((d) => {
    const imageUrl = d.media_asset?.[0]?.image_url ?? CONSTANTS.DEFAULT_DISH_IMAGE;
    const matchedTags = d.dish_tag
      ?.flatMap((dt) => dt.tag ?? [])
      ?.filter(Boolean) ?? [];

    // 整理可用门店
    const stores = d.dish_store
      ?.filter(ds => ds.available && ds.store)
      .map(ds => ({
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
  }) ?? [];


  /* ========== 6️⃣ 渲染页面 ========== */
  return (
    <>
      <Hero
        title="See Our Food"
        description="Your go-to for quick, convenient, and yummy Australian lobster and seafood rolls. Born and bred in Australia, to bring lobster and seafood rolls closer to you."
        imageUrl="/images/see-our-food-hero.jpg"
        size="medium"
      />
      <FoodSection tags={tags ?? []} dishes={dishes} />
      <LocationIndicator />
    </>
  );
}
