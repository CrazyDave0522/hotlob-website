const BASE_URL = 'https://places.googleapis.com/v1'

export interface GooglePlaceDetails {
  id: string
  displayName: {
    text: string
    languageCode: string
  }
  rating?: number
  userRatingCount?: number
  currentOpeningHours?: {
    openNow?: boolean
    periods?: Array<{
      open: {
        day: number
        hour: number
        minute: number
      }
      close?: {
        day: number
        hour: number
        minute: number
      }
    }>
    specialDays?: Array<{
      date: string
    }>
    type?: string
    weekdayDescriptions?: string[]
  }
  websiteUri?: string
  googleMapsUri?: string
}

export interface TradingHours {
  open_now?: boolean
  periods?: Array<{
    open: { day: number; hour: number; minute: number }
    close?: { day: number; hour: number; minute: number }
  }>
  weekday_text?: string[]
}

export interface GooglePlaceReview {
  name: string
  relativePublishTimeDescription: string
  time: string
  rating: number
  text: {
    text: string
    languageCode: string
  }
  originalText: {
    text: string
    languageCode: string
  }
  authorAttribution: {
    displayName: string
    uri: string
    photoUri: string
  }
  publishTime: string
}

export interface GooglePlaceReviewsResponse {
  reviews: GooglePlaceReview[]
  nextPageToken?: string
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

export function extractTradingHours(placeDetails: GooglePlaceDetails): TradingHours | null {
  if (placeDetails.currentOpeningHours) {
    const tradingHours: TradingHours = {}
    
    if (placeDetails.currentOpeningHours.openNow !== undefined) {
      tradingHours.open_now = placeDetails.currentOpeningHours.openNow
    }
    
    if (placeDetails.currentOpeningHours.periods) {
      tradingHours.periods = placeDetails.currentOpeningHours.periods
    }
    
    if (placeDetails.currentOpeningHours.weekdayDescriptions) {
      tradingHours.weekday_text = placeDetails.currentOpeningHours.weekdayDescriptions
    }
    
    return tradingHours
  }
  return null
}

export async function fetchPlaceReviews(placeId: string): Promise<GooglePlaceReview[]> {
  const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GMAPS_API_KEY
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('NEXT_PUBLIC_GMAPS_API_KEY is not set')
  }

  try {
    const response = await fetch(`${BASE_URL}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY as string,
        'X-Goog-FieldMask': 'reviews'
      } as HeadersInit
    })

    if (!response.ok) {
      console.error('Google Places API error:', response.status, response.statusText)
      return []
    }

    const data: GooglePlaceReviewsResponse = await response.json()
    return data.reviews || []
  } catch (error) {
    console.error('Failed to fetch place reviews:', error)
    return []
  }
}