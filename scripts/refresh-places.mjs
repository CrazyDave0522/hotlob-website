// scripts/refresh-places.mjs
// 测试脚本：获取门店并刷新 Google Places 数据

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const CRON_SECRET = process.env.CRON_SECRET
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

if (!SUPABASE_URL || !SUPABASE_KEY || !CRON_SECRET) {
  console.error('❌ 缺少环境变量')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  // 1. 获取所有门店
  const { data: stores, error } = await supabase
    .from('store')
    .select('id, name, google_place_id')
    .order('name')

  if (error) {
    console.error('❌ 查询门店失败:', error)
    return
  }

  console.log(`\n📍 找到 ${stores.length} 个门店:\n`)
  stores.forEach((s, i) => {
    console.log(`${i + 1}. ${s.name}`)
    console.log(`   ID: ${s.id}`)
    console.log(`   Place ID: ${s.google_place_id || '(未设置)'}\n`)
  })

  // 2. 选择第一个门店测试
  if (stores.length === 0) {
    console.log('没有门店数据')
    return
  }

  const firstStore = stores[0]
  console.log(`\n🔄 正在刷新: ${firstStore.name}...`)

  const url = `${BASE_URL}/api/places/${firstStore.id}/refresh`
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
      console.log('✅ 刷新成功:', data)
    } else {
      console.error('❌ 刷新失败:', data)
    }

    // 3. 查询缓存结果
    const { data: cache } = await supabase
      .from('place_cache')
      .select('*')
      .eq('store_id', firstStore.id)
      .single()

    if (cache) {
      console.log('\n📊 缓存数据:')
      console.log('  评分:', cache.rating)
      console.log('  评论数:', cache.user_ratings_total)
      console.log('  营业时间:', cache.opening_hours_weekday_text)
    }
  } catch (e) {
    console.error('❌ 请求失败:', e.message)
  }
}

main()
