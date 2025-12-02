"use client";

import DishCard from "./dish-card";
import { Dish, AllergenTag } from "@/types/types";

interface DishGridProps {
  dishes: Dish[];
  allergenTags: AllergenTag[];
}

export default function DishGrid({ dishes }: DishGridProps) {
  // Responsive handled purely via CSS media queries

  return (
    <div className="dish-grid-wrapper w-full flex justify-center">
      {/* Unified container: responsive width */}
      <div className="dish-grid-container mx-auto">
        {/* Responsive grid: 2 columns on mobile, 4 on desktop */}
        <div className="dish-grid grid items-end">
          {dishes.map((dish, index) => (
            <div key={dish.id} className="dish-grid-item flex items-end justify-center">
              <DishCard dish={dish} priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
