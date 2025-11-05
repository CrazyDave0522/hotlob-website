"use client";

import DishCard from "./dish-card";
import { Dish } from "@/types/types";

interface DishGridProps {
  dishes: Dish[];
}

export default function DishGrid({ dishes }: DishGridProps) {
  return (
    <div className="w-full flex justify-center pb-16 bg-[#F9F9F9]">
      {/* pt-[30px]: tag容器底部到图片顶部的距离 */}
      {/* 包装容器高度 600px = 120px(图片溢出) + 480px(卡片) */}
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
