import { supabase } from "./supabaseClient";

export interface ReviewData {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  photos?: string[]; // Optional: array of photo URLs
}

interface ReviewPhotoRow {
  photo_url: string;
  display_order: number;
}

interface CuratedReviewRow {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  review_photos?: ReviewPhotoRow[];
}

/**
 * Fetch curated featured reviews
 * @param limit Optional limit for number of reviews to fetch
 * @param includePhotos Optional flag to include review photos (default: false)
 * @returns Array of review data
 */
export async function getReviews(
  limit?: number,
  includePhotos: boolean = false
): Promise<ReviewData[]> {
  const selectFields = includePhotos
    ? ("author_name, author_photo_url, rating, review_text, review_photos (photo_url, display_order)" as const)
    : ("author_name, author_photo_url, rating, review_text" as const);

  let query = supabase
    .from('curated_reviews')
    .select(selectFields)
    .eq('is_featured', true)
    .order('featured_order', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query.returns<CuratedReviewRow[]>();

  if (error) {
    console.error('Error fetching curated_reviews:', error);
    return [];
  }

  const rawData = data || [];

  // Transform data to include sorted photos if requested
  return rawData.map((r) => ({
    author_name: r.author_name,
    author_photo_url: r.author_photo_url,
    rating: r.rating,
    review_text: r.review_text,
    ...(includePhotos && {
      photos: (r.review_photos || [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((p) => p.photo_url),
    }),
  }));
}
