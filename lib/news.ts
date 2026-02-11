import type {
  NewsArticle,
  NewsListItem,
  NewsFilters
} from '@/types/news'
import { supabase } from './supabase'

export async function fetchPublishedNews(filters: NewsFilters = {}): Promise<NewsArticle[]> {
  const {
    limit = 10,
    offset = 0,
    orderBy = 'publish_date',
    orderDirection = 'desc'
  } = filters

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch published news', error)
    return []
  }

  return data ?? []
}

export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!slug || slug.trim() === '') {
    console.error('Invalid slug provided to fetchNewsBySlug: slug is empty or undefined')
    return null
  }

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error(`Failed to fetch news by slug "${slug}":`, error)
    return null
  }

  return data
}

export async function fetchNewsListItems(limit = 10, offset = 0): Promise<NewsListItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('id, title, cover_image_url, excerpt, author, publish_date, slug')
    .eq('is_published', true)
    .order('publish_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Failed to fetch news list items', error)
    return []
  }

  return data ?? []
}

export async function fetchTotalPublishedNewsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  if (error) {
    console.error('Failed to fetch total published news count', error)
    return 0
  }

  return count ?? 0
}