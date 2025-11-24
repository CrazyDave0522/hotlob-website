"use client";

import { useState, useEffect } from "react";
import TagFilter from "./tag-filter";
import DishGrid from "./dish-grid";
import EmptyState from "./empty-state";
import { Dish, AllergenTag, CategoryOption } from "@/types/types";

interface FoodSectionProps {
  allergenTags: AllergenTag[];
  categoryOptions: CategoryOption[];
  dishes: Dish[];
}

export default function FoodSection({ allergenTags, categoryOptions, dishes }: FoodSectionProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter dishes based on selected categories (OR union):
  // When multiple categories are selected, show dishes that match any of the selected categories
  const filteredDishes =
    selectedCategoryIds.length === 0
      ? dishes
      : dishes.filter((dish) =>
          selectedCategoryIds.some((categoryId) => dish.category === categoryId)
        );

  return (
    <div
      style={isMobile ? {
        backgroundColor: '#F7F8FA',
        backgroundImage: 'url(/images/see-our-food-bg-mb.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'auto'
      } : {}}
    >
      <TagFilter tags={categoryOptions} onChange={setSelectedCategoryIds} />
      {filteredDishes.length > 0 ? (
        <DishGrid dishes={filteredDishes} allergenTags={allergenTags} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
