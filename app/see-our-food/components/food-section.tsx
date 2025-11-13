"use client";

import { useState } from "react";
import TagFilter from "./tag-filter";
import DishGrid from "./dish-grid";
import EmptyState from "./empty-state";
import { Dish, Tag } from "@/types/types";

interface FoodSectionProps {
  tags: Tag[];
  dishes: Dish[];
}

export default function FoodSection({ tags, dishes }: FoodSectionProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Filter dishes based on selected tags (AND intersection):
  // When multiple tags are selected, only show dishes that contain all selected tags
  const filteredDishes =
    selectedTagIds.length === 0
      ? dishes
      : dishes.filter((dish) =>
          selectedTagIds.every((tagId) => dish.tags.some((t) => t.id === tagId))
        );

  return (
    <>
      <TagFilter tags={tags} onChange={setSelectedTagIds} />
      {filteredDishes.length > 0 ? (
        <DishGrid dishes={filteredDishes} />
      ) : (
        <EmptyState />
      )}
    </>
  );
}
