const BASE_URL = 'https://places.googleapis.com/v1'

export interface GooglePlaceDetails {
  id: string
  displayName: { text: string }
  rating?: number
  userRatingCount?: number
  currentOpeningHours?: {
    openNow?: boolean
    periods?: Array<{
      open: { day: number; hour: number; minute: number }
      close?: { day: number; hour: number; minute: number }
    }>
    weekdayDescriptions?: string[]
  }
  websiteUri?: string
  googleMapsUri?: string
}

export async function fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GMAPS_API_KEY
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('NEXT_PUBLIC_GMAPS_API_KEY is not set')
  }

  try {
    const response = await fetch(`${BASE_URL}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY as string,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,currentOpeningHours,websiteUri,googleMapsUri'
      } as HeadersInit
    })

    if (!response.ok) {
      console.error('Google Places API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch place details:', error)
    return null
  }
}

export function extractRating(placeDetails: GooglePlaceDetails): { value: number; total: number } | null {
  if (placeDetails.rating !== undefined && placeDetails.userRatingCount !== undefined) {
    return {
      value: placeDetails.rating,
      total: placeDetails.userRatingCount
    }
  }
  return null
}

export function extractTradingHours(placeDetails: GooglePlaceDetails): object | null {
  if (placeDetails.currentOpeningHours) {
    return {
      open_now: placeDetails.currentOpeningHours.openNow,
      periods: placeDetails.currentOpeningHours.periods,
      weekday_text: placeDetails.currentOpeningHours.weekdayDescriptions
    }
  }
  return null
}