"use client";

import { useState, useEffect } from "react";
import DishCard from "./dish-card";
import { Dish, AllergenTag } from "@/types/types";

interface DishGridProps {
  dishes: Dish[];
  allergenTags: AllergenTag[];
}

export default function DishGrid({ dishes }: DishGridProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className="w-full flex justify-center bg-[#F9F9F9]"
      style={{ paddingBottom: isMobile ? "32px" : "min(3.333vw, 64px)" }} // 64/1920 = 3.333%
    >
      {/* Unified container: responsive width */}
      <div 
        className="mx-auto px-4"
        style={{ 
          width: isMobile ? '100%' : '72.917%', 
          maxWidth: isMobile ? 'none' : '1400px',
          paddingTop: isMobile ? "20px" : "min(1.563vw, 30px)" // 30/1920 = 1.563%
        }}
      >
        {/* Responsive grid: 2 columns on mobile, 4 on desktop */}
        <div 
          className="grid items-end"
          style={{ 
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? "24px" : "min(1.25vw, 24px)" // Mobile: 24px fixed, Desktop: responsive max 24px
          }}
        >
          {dishes.map((dish, index) => (
            <div 
              key={dish.id} 
              className="flex items-end justify-center"
              style={{ height: isMobile ? '700px' : 'min(31.25vw, 600px)' }} // Mobile: 700px to accommodate DishCard default state (590px), Desktop: 600/1920 = 31.25%
            >
              <DishCard dish={dish} priority={index < 4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
