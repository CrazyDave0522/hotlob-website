import Hero from "@/app/see-our-food/components/hero";
import StoreCard from "./components/store-card";
import ReviewsSection from "./components/reviews/ReviewsSection";
import { getStoresWithDetails } from "@/lib/getStores";
import { getReviews } from "@/lib/getReviews";

export const revalidate = 86400; // 24 hours ISR

export default async function OurLocationsPage() {
  // Fetch all stores with photos and ratings, sorted by rating
  const storesWithData = await getStoresWithDetails();

  // Fetch featured curated reviews with photos (limit 5)
  const featuredReviews = await getReviews(5, true);

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
        <div className="py-12 md:py-16">
          <div className="mx-auto" style={{ width: '72.917%', maxWidth: '1400px' }}>
            <div className="space-y-12">
            {storesWithData?.map((store, index: number) => (
              <StoreCard
                key={store.id}
                name={store.name}
                street={store.street}
                suburb={store.suburb}
                state={store.state}
                postcode={store.postcode}
                googleMapsEmbedUrl={store.google_maps_embed_url}
                photos={store.photos}
                rating={store.rating}
                openingHoursWeekdayText={store.openingHoursWeekdayText ?? undefined}
                isReversed={index % 2 === 1}
              />
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Reviews Section */}
      {featuredReviews.length > 0 && (
        <ReviewsSection reviews={featuredReviews} />
      )}
    </div>
  );
}
