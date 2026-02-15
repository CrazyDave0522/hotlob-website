export interface CuratedReview {
  id: string
  store_id: string
  google_review_id: string
  author_name: string
  author_photo_url?: string
  rating: number
  review_text: string
  review_time: string
  language?: string
  fetched_at: string
  expires_at: string
  created_at: string
  updated_at: string
  author_uri?: string
  text_length?: number
}