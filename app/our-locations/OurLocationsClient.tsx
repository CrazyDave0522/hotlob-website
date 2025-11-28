"use client";

import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Hero
        title="Find Hotlob near you"
        description={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.
Grab one on your lunch break, between uni lectures, or on your way home.`}
        imageUrl="/images/our-locations-hero.png"
        backgroundPositionY="60%"
      />

      <div
        className="bg-cover bg-center bg-no-repeat"
        style={isMobile ? {
          background: 'linear-gradient(180deg, #FBF3F3 0%, #FFF 100%)',
          backgroundImage: "url('/images/our-locations-bg-stores-mb.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'cover'
        } : {
          backgroundImage: "url('/images/our-locations-bg-stores.png')",
          backgroundSize: 'cover'
        }}
      >
        <div className="py-12 md:py-16">
          <div className="mx-auto" style={isMobile ? { width: '100%', maxWidth: '690px', padding: '0 16px' } : { width: '72.917%', maxWidth: '1400px' }}>
            <div className={isMobile ? "flex flex-col items-center space-y-12" : "space-y-12"}>
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
                isMobile={isMobile}
              />
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Reviews Section */}
      {featuredReviews.length > 0 && (
        <ReviewsSection reviews={featuredReviews} isMobile={isMobile} />
      )}
    </div>
  );
}