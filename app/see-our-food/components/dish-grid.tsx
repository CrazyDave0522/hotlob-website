"use client";

import DishCard from "./dish-card";
import { Dish } from "@/types/types";

interface DishGridProps {
  dishes: Dish[];
}

export default function DishGrid({ dishes }: DishGridProps) {
  return (
    <div className="w-full flex justify-center pb-16 bg-[#F9F9F9]">
      {/* pt-[30px]: distance from tag container bottom to image top */}
      {/* Wrapper container height 600px = 120px(image overflow) + 480px(card) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 items-end pt-[30px] max-w-[1600px]">
        {dishes.map((dish) => (
          <div key={dish.id} className="h-[600px] flex items-end">
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    </div>
  );
}
