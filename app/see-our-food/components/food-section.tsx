'use client'

import { useState } from 'react'
import TagFilter from './tag-filter'
import DishGrid from './dish-grid'
import EmptyState from './empty-state'
import { Dish, Tag } from '@/types/types'

interface FoodSectionProps {
  tags: Tag[]
  dishes: Dish[]
}

export default function FoodSection({ tags, dishes }: FoodSectionProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  // 根据选中的标签过滤菜品
  const filteredDishes = selectedTagIds.length === 0
    ? dishes
    : dishes.filter(dish =>
        dish.tags.some(dishTag =>
          selectedTagIds.includes(dishTag.id)
        )
      )

  return (
    <>
      <TagFilter tags={tags} onChange={setSelectedTagIds} />
      {filteredDishes.length > 0 ? (
        <DishGrid dishes={filteredDishes} />
      ) : (
        <EmptyState />
      )}
    </>
  )
}
