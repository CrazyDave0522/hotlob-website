"use client";

import { useEffect, useMemo, useState } from "react";

import type { AllergenTag, DishWithRelations, MediaAsset } from "@/types/dish";
import { fetchVisibleDishes } from "@/lib/dishes";
import { DishCard } from "./DishCard";
import { DishCardSkeleton } from "./DishCardSkeleton";

const DEFAULT_PAGE_SIZE = 10;

interface DishCardGridProps {
  limit?: number;
  pageSize?: number;
}

export function DishCardGrid({ limit, pageSize }: DishCardGridProps) {
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
    if (typeof limit === "number") {
      return dishes.slice(0, limit);
    }

    if (usePagination) {
      return dishes.slice(0, visibleCount);
    }

    return dishes;
  }, [dishes, limit, usePagination, visibleCount]);

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
          />
        );
      })}
    </div>
  );
}
