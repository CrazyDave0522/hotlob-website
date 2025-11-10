// lib/google-places.ts
import { getGMapsApiKey } from './serverEnv'

export interface PlaceCachePayload {
  rating: number | null
  user_ratings_total: number | null
  opening_hours_weekday_text: string[] | null
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
