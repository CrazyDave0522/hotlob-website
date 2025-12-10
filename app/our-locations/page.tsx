import { getStoresWithDetails } from "@/lib/getStores";
import { getReviews } from "@/lib/getReviews";
import OurLocationsClient from "./OurLocationsClient";

export default async function OurLocationsPage() {
  // Fetch all stores with photos and ratings, sorted by rating
  const storesWithData = await getStoresWithDetails();

  // Fetch featured curated reviews with photos (limit 5)
  const featuredReviews = await getReviews(5, true);

  return (
    <OurLocationsClient storesWithData={storesWithData} featuredReviews={featuredReviews} />
  );
}
