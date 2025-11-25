import Hero from "@/app/see-our-food/components/hero";
import StoreCard from "./components/store-card";
import ReviewsSection from "./components/reviews/ReviewsSection";
import { getStoresWithDetails } from "@/lib/getStores";
import { getReviews } from "@/lib/getReviews";
import OurLocationsClient from "./OurLocationsClient";

export const revalidate = 86400; // 24 hours ISR

export default async function OurLocationsPage() {
  // Fetch all stores with photos and ratings, sorted by rating
  const storesWithData = await getStoresWithDetails();

  // Fetch featured curated reviews with photos (limit 5)
  const featuredReviews = await getReviews(5, true);

  return (
    <OurLocationsClient storesWithData={storesWithData} featuredReviews={featuredReviews} />
  );
}
