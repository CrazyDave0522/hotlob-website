import { supabase } from "@/lib/supabaseClient";

export interface Store {
  id: string;
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  google_maps_embed_url: string | null;
}

export interface StorePhoto {
  photo_url: string;
  display_order: number;
}

export interface StoreWithData {
  id: string;
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  google_maps_embed_url: string | null;
  photos: StorePhoto[];
  rating: number | null;
  openingHoursWeekdayText: string[] | null;
}

interface PhotoFromDB {
  store_id: string;
  photo_url: string;
  display_order: number;
}

interface PlaceCacheRow {
  store_id: string;
  rating: number | string | null;
  opening_hours_weekday_text: string[] | null;
}

export async function getStores(limit?: number): Promise<StoreWithData[]> {
  // Fetch all stores
  const { data: stores, error } = await supabase
    .from("store")
    .select("id, name, street, suburb, state, postcode, google_maps_embed_url")
    .order("name");

  if (error) {
    console.error("Error fetching stores:", error);
    return [];
  }

  if (!stores || stores.length === 0) {
    return [];
  }

  // Fetch photos for all stores (max 3 per store)
  const storeIds = stores.map((s: Store) => s.id);
  const { data: photos } = await supabase
    .from("store_photos")
    .select("store_id, photo_url, display_order")
    .in("store_id", storeIds)
    .order("display_order");

  // Group photos by store_id, taking max 3 per store
  const photosByStore: Record<string, StorePhoto[]> = {};
  (photos as PhotoFromDB[] | null)?.forEach((photo) => {
    if (!photosByStore[photo.store_id]) {
      photosByStore[photo.store_id] = [];
    }
    if (photosByStore[photo.store_id].length < 3) {
      photosByStore[photo.store_id].push({
        photo_url: photo.photo_url,
        display_order: photo.display_order,
      });
    }
  });

  // Fetch place cache for rating and opening hours
  const { data: cacheData, error: cacheError } = await supabase
    .from("place_cache")
    .select("store_id, rating, opening_hours_weekday_text")
    .in("store_id", storeIds);

  if (cacheError) {
    console.error("Error fetching place_cache:", cacheError);
  }

  const cacheByStore: Record<string, { rating: number | null; weekdayText: string[] | null }> = {};
  (cacheData as PlaceCacheRow[] | null)?.forEach((row) => {
    const ratingValue = row.rating === null ? null : typeof row.rating === "number" ? row.rating : parseFloat(row.rating);
    cacheByStore[row.store_id] = {
      rating: Number.isFinite(ratingValue as number) ? (ratingValue as number) : null,
      weekdayText: row.opening_hours_weekday_text ?? null,
    };
  });

  // Combine data
  const storesWithData: StoreWithData[] = stores.map((store: Store) => ({
    ...store,
    photos: photosByStore[store.id] || [],
    rating: cacheByStore[store.id]?.rating ?? null,
    openingHoursWeekdayText: cacheByStore[store.id]?.weekdayText ?? null,
  }));

  // Sort by rating (descending), null ratings go to the end
  storesWithData.sort((a, b) => {
    if (a.rating === null && b.rating === null) return 0;
    if (a.rating === null) return 1;
    if (b.rating === null) return -1;
    return b.rating - a.rating;
  });

  // Apply limit if specified
  return limit ? storesWithData.slice(0, limit) : storesWithData;
}
