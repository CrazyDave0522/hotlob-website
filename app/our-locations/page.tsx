import { supabase } from "@/lib/supabaseClient";
import Hero from "@/app/see-our-food/components/hero";
import StoreCard from "./components/store-card";

interface Store {
  id: string;
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  google_maps_embed_url: string | null;
}

interface StorePhoto {
  photo_url: string;
  display_order: number;
}

interface PhotoFromDB {
  store_id: string;
  photo_url: string;
  display_order: number;
}

export const revalidate = 86400; // 24 hours ISR

export default async function OurLocationsPage() {
  // Fetch all stores with their photos
  const { data: stores, error } = await supabase
    .from("store")
    .select("id, name, street, suburb, state, postcode, google_maps_embed_url")
    .order("name");

  if (error) {
    console.error("Error fetching stores:", error);
    return (
      <div className="min-h-screen bg-[#F9F9F9]">
        <Hero
          title="Our Locations"
          description="Find your nearest Hotlob location"
          imageUrl="/images/our-locations-hero.jpg"
        />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-red-600">
            Failed to load locations. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Fetch photos for all stores (max 3 per store)
  const storeIds = stores?.map((s: Store) => s.id) || [];
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

  // Fetch place cache for rating and opening hours (weekday_text)
  interface PlaceCacheRow {
    store_id: string;
    rating: number | string | null;
    opening_hours_weekday_text: string[] | null;
  }

  const cacheByStore: Record<string, { rating: number | null; weekdayText: string[] | null }> = {};
  if (storeIds.length > 0) {
    const { data: cacheData, error: cacheError } = await supabase
      .from("place_cache")
      .select("store_id, rating, opening_hours_weekday_text")
      .in("store_id", storeIds);

    if (cacheError) {
      console.error("Error fetching place_cache:", cacheError);
    }

    (cacheData as PlaceCacheRow[] | null)?.forEach((row) => {
      const ratingValue = row.rating === null ? null : typeof row.rating === "number" ? row.rating : parseFloat(row.rating);
      cacheByStore[row.store_id] = {
        rating: Number.isFinite(ratingValue as number) ? (ratingValue as number) : null,
        weekdayText: row.opening_hours_weekday_text ?? null,
      };
    });
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Hero
        title="Find Hotlob near you"
        description={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.
Grab one on your lunch break, between uni lectures, or on your way home.`}
        imageUrl="/images/our-locations-hero.png"
        backgroundPositionY="60%"
      />

      <div className="bg-[url('/images/our-locations-bg-stores.png')] bg-cover bg-center bg-no-repeat">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="space-y-12">
            {stores?.map((store: Store, index: number) => (
              <StoreCard
                key={store.id}
                name={store.name}
                street={store.street}
                suburb={store.suburb}
                state={store.state}
                postcode={store.postcode}
                googleMapsEmbedUrl={store.google_maps_embed_url}
                photos={photosByStore[store.id] || []}
                rating={cacheByStore[store.id]?.rating ?? null}
                openingHoursWeekdayText={cacheByStore[store.id]?.weekdayText ?? undefined}
                isReversed={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
