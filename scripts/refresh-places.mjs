// scripts/refresh-places.mjs
// Development tool: List stores and manually test Google Places API refresh
// Usage: pnpm refresh-places

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const CRON_SECRET = process.env.CRON_SECRET
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

if (!SUPABASE_URL || !SUPABASE_KEY || !CRON_SECRET) {
  console.error('❌ Missing required environment variables')
  console.error('   Please ensure .env.local contains:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('   - CRON_SECRET')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  console.log('🔍 Hotlob Places Refresh Test Script\n')
  
  // 1. Fetch all stores
  const { data: stores, error } = await supabase
    .from('store')
    .select('id, name, google_place_id')
    .order('name')

  if (error) {
    console.error('❌ Failed to query stores:', error)
    return
  }

  console.log(`📍 Found ${stores.length} store(s):\n`)
  stores.forEach((s, i) => {
    console.log(`${i + 1}. ${s.name}`)
    console.log(`   ID: ${s.id}`)
    console.log(`   Place ID: ${s.google_place_id || '(not set)'}\n`)
  })

  // 2. Test refresh on first store
  if (stores.length === 0) {
    console.log('⚠️  No stores found in database')
    return
  }

  const firstStore = stores[0]
  console.log(`\n🔄 Refreshing: ${firstStore.name}...`)

  const url = `${BASE_URL}/api/stores/${firstStore.id}/refresh`
  const headers = {
    'Authorization': `Bearer ${CRON_SECRET}`,
    'Content-Type': 'application/json'
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers
    })
    const data = await res.json()
    
    if (res.ok) {
      console.log('✅ Refresh successful:', data)
    } else {
      console.error('❌ Refresh failed:', data)
    }

    // 3. Query cache results
    const { data: cache } = await supabase
      .from('place_cache')
      .select('*')
      .eq('store_id', firstStore.id)
      .single()

    if (cache) {
      console.log('\n📊 Cache data:')
      console.log('  Rating:', cache.rating || '(none)')
      console.log('  Reviews:', cache.user_ratings_total || '(none)')
      console.log('  Hours:', cache.opening_hours_weekday_text || '(none)')
    } else {
      console.log('\n⚠️  No cache data found for this store')
    }

    // 4. Query curated reviews diagnostics
    const { data: allCurated, error: curatedErr } = await supabase
      .from('curated_reviews')
      .select('id, store_id, author_name, rating, length:review_text, is_featured, review_time')
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })

    if (curatedErr) {
      console.error('❌ Curated reviews query failed:', curatedErr)
    } else {
      console.log(`\n📝 Curated reviews total: ${allCurated.length}`)
      const featured = allCurated.filter(r => r.is_featured)
      console.log(`⭐ Featured reviews: ${featured.length}`)
      console.log('First 5 rows:', allCurated.slice(0, 5))
    }
  } catch (e) {
    console.error('❌ Request failed:', e.message)
  }
}

main()
