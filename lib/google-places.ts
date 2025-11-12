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
  author_uri: string | null // Google Maps contributor URI
  rating: number
  review_text: string
  language: string | null
  review_time_iso: string // ISO string
}

// Google Places (New) v1 - Photo types
interface PlacesApiAuthorAttributionPhoto {
  displayName?: string
  uri?: string
  photoUri?: string
}

interface PlacesApiPhoto {
  name: string // Resource name like "places/{place_id}/photos/{photo_id}"
  widthPx?: number
  heightPx?: number
  authorAttributions?: PlacesApiAuthorAttributionPhoto[]
}

export interface NormalizedPhoto {
  photo_name: string // Google photo resource name
  photo_url: string // Full URL with maxWidthPx parameter
  width: number
  height: number
  author_name: string
  author_uri: string | null
  author_uris: string[] // all contributor URIs for this photo
  author_names: string[] // all attribution display names for this photo
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
    const author_uri = r.authorAttribution?.uri || null
    const text = r.originalText?.text || r.text?.text || ''
    const language = r.originalText?.languageCode || r.text?.languageCode || null
    const publishIso = r.publishTime ? new Date(r.publishTime).toISOString() : ''
    const google_id = typeof r.name === 'string' ? r.name : null

    if (!publishIso) continue // skip if no time

    normalized.push({
      google_review_id: google_id,
      author_name,
      author_photo_url,
      author_uri,
      rating: Math.round(rating),
      review_text: text,
      language,
      review_time_iso: publishIso,
    })
  }

  return normalized
}

// Fetch photos for a place. Returns up to 10 photos with author attribution.
export async function fetchPlacePhotos(placeId: string, apiKey?: string): Promise<NormalizedPhoto[]> {
  const key = apiKey || getGMapsApiKey()
  const url = `https://places.googleapis.com/v1/places/${placeId}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'photos',
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Places API (photos) error:', res.status, errorText)
    return []
  }

  const data = await res.json()
  const photos: PlacesApiPhoto[] = Array.isArray(data.photos) ? data.photos : []

  const normalized: NormalizedPhoto[] = []
  for (const p of photos) {
    if (!p.name) continue

    const attributions = Array.isArray(p.authorAttributions) ? p.authorAttributions : []
    const primary = attributions[0]
    const author_name = primary?.displayName || 'Unknown'
    const author_uri = primary?.uri || null
    const author_uris = attributions
      .map(a => a?.uri)
      .filter((u): u is string => typeof u === 'string' && u.length > 0)
    const author_names = attributions
      .map(a => (typeof a?.displayName === 'string' ? a.displayName : ''))
      .filter(n => n.length > 0)
    const width = p.widthPx || 0
    const height = p.heightPx || 0

    // Generate photo URL with maxWidthPx=600 for optimal quality
    const photo_url = `https://places.googleapis.com/v1/${p.name}/media?maxWidthPx=600&key=${key}`

    normalized.push({
      photo_name: p.name,
      photo_url,
      width,
      height,
      author_name,
      author_uri,
      author_uris,
      author_names,
    })
  }

  return normalized
}
