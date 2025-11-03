'use client'

import DishCard from './dish-card'
import { Dish } from '@/types/types'

interface DishGridProps {
  dishes: Dish[]
}

export default function DishGrid({ dishes }: DishGridProps) {
  return (
    <div className="w-full flex justify-center py-16 bg-[#F9F9F9]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center max-w-[1600px]">
        {dishes.map(dish => (
          <DishCard
            key={dish.id}
            name={dish.name}
            description={dish.description}
            tier={dish.tier}
            imageUrl={dish.imageUrl}
            tags={dish.tags}
            stores={dish.stores}
          />
        ))}
      </div>
    </div>
  )
}
