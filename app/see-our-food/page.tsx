"use client";

import { useEffect, useMemo, useState } from "react";

import Hero from "@/components/layout/Hero";
import CategoryFilter from "@/components/food/CategoryFilter";
import { DishCardGrid } from "@/components/cards/DishCardGrid";
import { fetchVisibleDishes } from "@/lib/dishes";
import type { DishWithRelations } from "@/types/dish";
import "@/styles/components/food/see-our-food.css";

export default function SeeOurFoodPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dishes, setDishes] = useState<DishWithRelations[]>([]);

  // Derive available categories from dish data
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    dishes.forEach((dish) => {
      if (dish.category) {
        categories.add(dish.category);
      }
    });
    return Array.from(categories).sort();
  }, [dishes]);

  useEffect(() => {
    const loadDishes = async () => {
      const data = await fetchVisibleDishes();
      setDishes(data);
    };

    loadDishes();
  }, []);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <main>
      <Hero
        variant="short"
        bgImage="/images/hero-bg/see-our-food-hero.jpg"
        title="See Our Food"
        subtitle={`You have to try their lobster rolls — they're addictive. And their other rolls are so good, I want to go back for more.\n— Google Review ⭐⭐⭐⭐⭐`}
        overlay={true}
      />
      <div className="SeeOurFoodPage-background">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          availableCategories={availableCategories}
        />
        <section >
          <DishCardGrid pageSize={10} categoryFilter={selectedCategory} />
        </section>
      </div>
    </main>
  );
}
