import type { CuratedReview } from '@/types/review'
import { supabase } from './supabaseClient'

export async function fetchReviews(): Promise<CuratedReview[]> {
  const { data, error } = await supabase
    .from('curated_reviews')
    .select('*')
    .eq('language', 'en')
    .gte('rating', 4)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Failed to fetch reviews:', error)
    throw new Error('Failed to fetch customer reviews')
  }

  return data ?? []
}