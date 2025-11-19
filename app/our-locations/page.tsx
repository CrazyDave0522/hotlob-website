import { supabase } from "@/lib/supabaseClient";
import Hero from "@/app/see-our-food/components/hero";
import StoreCard from "./components/store-card";
import ReviewsSection from "./components/reviews/ReviewsSection";
import { getStores } from "@/lib/getStores";

export const revalidate = 86400; // 24 hours ISR

export default async function OurLocationsPage() {
  // Fetch all stores with photos and ratings, sorted by rating
  const storesWithData = await getStores();

  // Fetch featured curated reviews (global top 10) with photos
  interface ReviewPhotoRow {
    photo_url: string
    display_order: number
  }

  interface CuratedReviewRow {
    id: string
    author_name: string
    author_photo_url: string | null
    rating: number
    review_text: string
    review_photos: ReviewPhotoRow[]
  }
  
  let featuredReviews: CuratedReviewRow[] = []
  {
    const { data: reviewsData, error: reviewsErr } = await supabase
      .from('curated_reviews')
      .select(`
        id,
        author_name, 
        author_photo_url, 
        rating, 
        review_text,
        review_photos (
          photo_url,
          display_order
        )
      `)
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(5)

    if (reviewsErr) {
      console.error('Error fetching curated_reviews:', reviewsErr)
    } else {
      featuredReviews = (reviewsData || []) as unknown as CuratedReviewRow[]
    }
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
        <ReviewsSection
          reviews={featuredReviews.map(r => ({
            author_name: r.author_name,
            author_photo_url: r.author_photo_url,
            rating: r.rating,
            review_text: r.review_text,
            photos: (r.review_photos || [])
              .sort((a, b) => a.display_order - b.display_order)
              .map(p => p.photo_url),
          }))}
        />
      )}
    </div>
  );
}
