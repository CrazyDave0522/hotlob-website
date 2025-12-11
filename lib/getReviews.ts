import { supabase } from "./supabaseClient";

// Validate a remote URL with a short request timeout.
// Some CDNs (including Google Places media) reject or mishandle HEAD requests,
// which causes false negatives. Use a lightweight GET asking for just the
// first byte (`Range: bytes=0-0`) and accept 200/206 as evidence the URL is live.
async function isUrlAlive(url: string, timeoutMs = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      // Request only the first byte to avoid downloading full images.
      headers: { Range: 'bytes=0-0' },
    } as RequestInit);
    clearTimeout(id);

    // Treat 200 (OK) and 206 (Partial Content) as alive. `res.ok` covers 200,
    // but some servers respond with 206 when Range header is honored.
    return res.ok || res.status === 206;
  } catch {
    return false;
  }
}

export interface ReviewData {
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  review_time: string;
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
  review_time: string;
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
    ? ("author_name, author_photo_url, rating, review_text, review_time, review_photos (photo_url, display_order)" as const)
    : ("author_name, author_photo_url, rating, review_text, review_time" as const);

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

  // Transform data to include sorted photos if requested.
  // When `includePhotos` is true, validate photo URLs server-side with a short
  // HEAD request so we don't render broken photo URLs into the server HTML.
  if (includePhotos) {
    const results = await Promise.all(
      rawData.map(async (r) => {
        const rawPhotos = (r.review_photos || [])
          .sort((a, b) => a.display_order - b.display_order)
          .map((p) => p.photo_url);

        // Check each URL with a short timeout; filter out non-200s.
        const checks = await Promise.all(rawPhotos.map(async (url) => ({ url, ok: await isUrlAlive(url) })));
        const livePhotos = checks.filter(c => c.ok).map(c => c.url);

        return {
          author_name: r.author_name,
          author_photo_url: r.author_photo_url,
          rating: r.rating,
          review_text: r.review_text,
          review_time: r.review_time,
          photos: livePhotos,
        };
      })
    );

    return results;
  }

  return rawData.map((r) => ({
    author_name: r.author_name,
    author_photo_url: r.author_photo_url,
    rating: r.rating,
    review_text: r.review_text,
    review_time: r.review_time,
  }));
}
