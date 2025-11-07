// app/see-our-food/page.tsx
import Hero from "./components/hero";
import FoodSection from "./components/food-section";
import { supabase } from "@/lib/supabaseClient";
import { CONSTANTS } from "@/lib/constants";
import type { Dish, RawDish } from "@/types/types";

export const revalidate = CONSTANTS.REVALIDATE_TIME; // ISR: 重新验证数据

export default async function SeeOurFoodPage() {
  /* ========== 拉取标签 和 菜品(含图片/标签) 并行 ========== */
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

  if (tagError) console.error("❌ 拉取 tags 失败:", tagError);
  if (dishError) {
    console.error("❌ 拉取 dish(含媒体/标签) 失败:", dishError);
    console.log("dishesRaw", dishesRaw);
  }

  /* ========== 整合数据 ========== */
  const dishes: Dish[] = ((dishesRaw as RawDish[] | null) ?? [])
    .map((d) => {
      const imageUrl =
        d.media_asset?.[0]?.image_url ?? CONSTANTS.DEFAULT_DISH_IMAGE;
      const matchedTags =
        d.dish_tag?.flatMap((dt) => dt.tag ?? [])?.filter(Boolean) ?? [];

      // 整理可用门店
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

  // 仅展示被当前可展示菜品实际使用到的标签
  const activeTagIds = new Set<string>();
  for (const d of dishes) {
    for (const t of d.tags) activeTagIds.add(t.id);
  }
  const filteredTags = (tags ?? []).filter((t) => activeTagIds.has(t.id));

  /* ========== 6️⃣ 渲染页面 ========== */
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
      {/* 根据活跃菜品过滤后的标签传给 FoodSection */}
  <FoodSection tags={filteredTags} dishes={dishes} />
    </>
  );
}
