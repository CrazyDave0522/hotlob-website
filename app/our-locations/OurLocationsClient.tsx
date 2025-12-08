"use client";

import Hero from "@/app/see-our-food/components/hero";
import StoreCard from "./components/store-card";
import ReviewsSection from "./components/reviews/ReviewsSection";

interface StoreWithData {
  id: string;
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  google_maps_embed_url: string | null;
  photos: Array<{ photo_url: string; display_order: number }>;
  rating: number | null;
  openingHoursWeekdayText: string[] | null;
  uber_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  email?: string | null;
}

interface ReviewItem {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  review_time: string;
  photos?: string[];
}

interface OurLocationsClientProps {
  storesWithData: StoreWithData[];
  featuredReviews: ReviewItem[];
}

export default function OurLocationsClient({ storesWithData, featuredReviews }: OurLocationsClientProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Hero
        title="Find Hotlob near you"
        description={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.
Grab one on your lunch break, between uni lectures, or on your way home.`}
        imageUrl="/images/our-locations-hero.png"
        backgroundPositionY="60%"
      />

      <div className="our-locations-stores-bg">
        <div className="mx-auto w-full max-w-[690px] px-4 md:w-[72.917%] md:max-w-[1400px] md:px-0">
          <div className="flex flex-col items-center md:block">
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

      {/* Featured Reviews Section */}
      {featuredReviews.length > 0 && (
        <ReviewsSection reviews={featuredReviews} />
      )}
    </div>
  );
}