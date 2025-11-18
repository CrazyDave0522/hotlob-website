"use client";

import DishCard from "./dish-card";
import { Dish } from "@/types/types";

interface DishGridProps {
  dishes: Dish[];
}

export default function DishGrid({ dishes }: DishGridProps) {
  return (
    <div 
      className="w-full flex justify-center bg-[#F9F9F9]"
      style={{ paddingBottom: "min(3.333vw, 64px)" }} // 64/1920 = 3.333%
    >
      {/* Unified container: 72.917% (1400px at 1920px width) */}
      <div 
        className="mx-auto"
        style={{ 
          width: '72.917%', 
          maxWidth: '1400px',
          paddingTop: "min(1.563vw, 30px)" // 30/1920 = 1.563%
        }}
      >
        {/* Fixed 4 columns grid, gap 24px */}
        <div 
          className="grid items-end"
          style={{ 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: "min(1.25vw, 24px)" // 24/1920 = 1.25%
          }}
        >
          {dishes.map((dish, index) => (
            <div 
              key={dish.id} 
              className="flex items-end justify-center"
              style={{ height: 'min(31.25vw, 600px)' }} // 600/1920 = 31.25%
            >
              <DishCard dish={dish} priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
