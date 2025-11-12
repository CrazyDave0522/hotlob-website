// lib/google-places.ts
import { getGMapsApiKey } from './serverEnv'

export interface PlaceCachePayload {
  rating: number | null
  user_ratings_total: number | null
  opening_hours_weekday_text: string[] | null
}

// Google Places (New) v1 - Review types (subset)
interface PlacesApiReviewText {
  text?: string
  languageCode?: string
}

interface PlacesApiAuthorAttribution {
  displayName?: string
  uri?: string
  photoUri?: string
}

interface PlacesApiReview {
  name?: string // google review id
  rating?: number
  originalText?: PlacesApiReviewText
  text?: PlacesApiReviewText
  publishTime?: string // ISO timestamp
  authorAttribution?: PlacesApiAuthorAttribution
}

export interface NormalizedReview {
  google_review_id: string | null
  author_name: string
  author_photo_url: string | null
  rating: number
  review_text: string
  language: string | null
  review_time_iso: string // ISO string
}

export async function fetchPlaceDetails(placeId: string, apiKey?: string): Promise<PlaceCachePayload> {
  const key = apiKey || getGMapsApiKey()
  
  // Use Places API (New) - different endpoint and format
  const url = `https://places.googleapis.com/v1/places/${placeId}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'rating,userRatingCount,regularOpeningHours.weekdayDescriptions'
    },
    next: { revalidate: 0 }
  })
  
  if (!res.ok) {
    const errorText = await res.text()
    console.error('Places API error:', res.status, errorText)
    throw new Error(`Places Details HTTP ${res.status}`)
  }
  
  const data = await res.json()
  
  // Parse new API format
  const rating = typeof data.rating === 'number' ? data.rating : null
  const user_ratings_total = typeof data.userRatingCount === 'number' ? data.userRatingCount : null
  const weekday_text = Array.isArray(data.regularOpeningHours?.weekdayDescriptions) 
    ? data.regularOpeningHours.weekdayDescriptions as string[] 
    : null
  
  return {
    rating,
    user_ratings_total,
    opening_hours_weekday_text: weekday_text,
  }
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// Fetch reviews for a place. Returns up to ~5 most relevant reviews as normalized objects.
export async function fetchPlaceReviews(placeId: string, apiKey?: string): Promise<NormalizedReview[]> {
  const key = apiKey || getGMapsApiKey()
  const url = `https://places.googleapis.com/v1/places/${placeId}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'reviews.rating,reviews.text,reviews.originalText,reviews.publishTime,reviews.authorAttribution,reviews.name',
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Places API (reviews) error:', res.status, errorText)
    return []
  }

  const data = await res.json()
  const reviews: PlacesApiReview[] = Array.isArray(data.reviews) ? data.reviews : []

  const normalized: NormalizedReview[] = []
  for (const r of reviews) {
    const rating = typeof r.rating === 'number' ? r.rating : 0
    const author_name = r.authorAttribution?.displayName || 'Anonymous'
    const author_photo_url = r.authorAttribution?.photoUri || null
    const text = r.originalText?.text || r.text?.text || ''
    const language = r.originalText?.languageCode || r.text?.languageCode || null
    const publishIso = r.publishTime ? new Date(r.publishTime).toISOString() : ''
    const google_id = typeof r.name === 'string' ? r.name : null

    if (!publishIso) continue // skip if no time

    normalized.push({
      google_review_id: google_id,
      author_name,
      author_photo_url,
      rating: Math.round(rating),
      review_text: text,
      language,
      review_time_iso: publishIso,
    })
  }

  return normalized
}
