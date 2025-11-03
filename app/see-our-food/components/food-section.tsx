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

  // 根据选中的标签过滤菜品（AND 交集）：
  // 当选择了多个标签时，仅展示同时包含所有已选标签的菜品
  const filteredDishes = selectedTagIds.length === 0
    ? dishes
    : dishes.filter(dish =>
        selectedTagIds.every(tagId => dish.tags.some(t => t.id === tagId))
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
