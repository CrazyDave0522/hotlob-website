# Type Definitions

This directory contains TypeScript type definitions used throughout the application.

## Review Types

### CuratedReview

Represents a customer review stored in the database, fetched from Google Places API.

```typescript
interface CuratedReview {
  id: string                    // Primary key
  store_id: string              // Foreign key to store table
  google_review_id: string      // Unique identifier from Google Places API
  author_name: string           // Review author's display name
  author_photo_url?: string     // Author's profile photo URL
  rating: number                // Star rating (1-5)
  review_text: string           // Full review text content
  review_time: string           // ISO timestamp of when review was posted
  language?: string             // Language code (e.g., 'en', 'es')
  fetched_at: string            // ISO timestamp of when review was fetched
  expires_at: string            // ISO timestamp of when review expires (30 days after fetch)
  created_at: string            // Database creation timestamp
  updated_at: string            // Database last update timestamp
  author_uri?: string           // Author's Google profile URI
  text_length?: number          // Character count of review text
}
```

### Google Places API Types

#### GooglePlaceReview

Raw review data structure returned by Google Places API (New).

```typescript
interface GooglePlaceReview {
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
```

#### GooglePlaceReviewsResponse

API response wrapper for reviews endpoint.

```typescript
interface GooglePlaceReviewsResponse {
  reviews: GooglePlaceReview[]
  nextPageToken?: string
}
```

## Usage

Import types as needed:

```typescript
import { CuratedReview } from '@/types/review'
import { GooglePlaceReview } from '@/lib/google-places'
```