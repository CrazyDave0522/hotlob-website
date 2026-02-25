"use client";

import { useEffect, useMemo, useState } from "react";

import type { AllergenTag, DishWithRelations, MediaAsset } from "@/types/dish";
import { fetchVisibleDishes } from "@/lib/dishes";
import { getAvailableStoresForDish, type StoreWithDistance } from "@/utils/dishOrdering";
import { DishCard } from "./DishCard";
import { DishCardSkeleton } from "./DishCardSkeleton";
import { StoreSelectionModal } from "@/components/store/StoreSelectionModal";

const DEFAULT_PAGE_SIZE = 10;

interface DishCardGridProps {
  limit?: number;
  pageSize?: number;
  categoryFilter?: string | null;
}

export function DishCardGrid({ limit, pageSize, categoryFilter }: DishCardGridProps) {
  const usePagination =
    typeof pageSize === "number" && typeof limit !== "number";
  const resolvedPageSize = pageSize ?? DEFAULT_PAGE_SIZE;

  const [dishes, setDishes] = useState<DishWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(
    usePagination ? resolvedPageSize : 0,
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStores, setAvailableStores] = useState<StoreWithDistance[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadDishes = async () => {
      const data = await fetchVisibleDishes();
      if (!isMounted) {
        return;
      }

      setIsLoading(false);
      setDishes(data);

      if (usePagination) {
        setVisibleCount(Math.min(resolvedPageSize, data.length));
      }
    };

    loadDishes();

    return () => {
      isMounted = false;
    };
  }, [resolvedPageSize, usePagination]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateMatch = () => {
      setIsDesktop(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setExpandedIndex(null);
      }
    };

    updateMatch();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateMatch);
    } else {
      mediaQuery.addListener(updateMatch);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateMatch);
      } else {
        mediaQuery.removeListener(updateMatch);
      }
    };
  }, []);

  useEffect(() => {
    if (!usePagination || typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      if (visibleCount >= dishes.length) {
        return;
      }

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (nearBottom) {
        setVisibleCount((prevCount) =>
          Math.min(prevCount + resolvedPageSize, dishes.length),
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dishes.length, resolvedPageSize, usePagination, visibleCount]);

  const displayedDishes = useMemo(() => {
    let filteredDishes = dishes;

    // Apply category filtering
    if (categoryFilter && categoryFilter !== "all") {
      filteredDishes = dishes.filter(dish => dish.category === categoryFilter);
    }

    if (typeof limit === "number") {
      return filteredDishes.slice(0, limit);
    }

    if (usePagination) {
      return filteredDishes.slice(0, visibleCount);
    }

    return filteredDishes;
  }, [dishes, limit, usePagination, visibleCount, categoryFilter]);

  const handleHover = (index: number) => {
    if (!isDesktop) {
      return;
    }

    setExpandedIndex(index);
  };

  const handleLeave = () => {
    if (!isDesktop) {
      return;
    }

    setExpandedIndex(null);
  };

  const handleOrder = async (dishId: string) => {
    const stores = await getAvailableStoresForDish(dishId);
    setAvailableStores(stores);
    setIsModalOpen(true);
  };

  const handleStoreSelect = (store: StoreWithDistance) => {
    // Open the dish-specific Uber URL in a new tab
    window.open(store.dishUberUrl, '_blank');
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="DishCardGrid">
        {Array.from({ length: usePagination ? resolvedPageSize : limit ?? 4 }).map(
          (_, index) => (
            <DishCardSkeleton key={`skeleton-${index}`} />
          ),
        )}
      </div>
    );
  }

  if (dishes.length === 0) {
    return null;
  }

  return (
    <>
      <div className="DishCardGrid">
        {displayedDishes.map((dish, index) => {
          const primaryImage: MediaAsset | null =
            dish.media_asset?.find((asset) => asset.position === 1) ??
            dish.media_asset?.[0] ??
            null;

          const allergens: AllergenTag[] = (dish.dish_allergen ?? [])
            .flatMap((item) => item.allergen_tag ?? [])
            .filter((tag): tag is AllergenTag => Boolean(tag));

          return (
            <DishCard
              key={dish.id}
              dish={dish}
              image={primaryImage}
              allergens={allergens}
              expanded={expandedIndex === index}
              onHover={() => handleHover(index)}
              onLeave={handleLeave}
              onOrder={() => handleOrder(dish.id)}
            />
          );
        })}
      </div>
      <StoreSelectionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStoreSelect={handleStoreSelect}
        stores={availableStores}
      />
    </>
  );
}
