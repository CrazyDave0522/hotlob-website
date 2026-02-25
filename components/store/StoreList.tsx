"use client";

import React, { useEffect, useState } from "react";
import StoreItem from "./StoreItem";
import StoreSkeleton from "./StoreSkeleton";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { fetchStoresWithPhotos } from "@/lib/store";
import type { Store, StorePhoto } from "@/types/store";
import "@/styles/components/store/store-list.css";

type StoreWithPhotos = Store & { photos: StorePhoto[] };

interface StoreListProps {
  variant?: 'alternating' | 'carousel-left';
}

export default function StoreList({ variant = 'alternating' }: StoreListProps) {
  const [stores, setStores] = useState<StoreWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Determine if desktop on client side
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    async function loadStores() {
      setLoading(true)
      setErrorMessage(null)
      try {
        const data = await fetchStoresWithPhotos()
        setStores(data || [])
      } catch (err) {
        console.error("Failed to load stores:", err)
        setErrorMessage('Failed to load stores')
        setStores([])
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, []);

  if (loading) {
    return (
      <div className="store-list">
        <StoreSkeleton />
        <StoreSkeleton />
        <StoreSkeleton />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="store-list">
        <div role="status" className="store-list-error">{errorMessage}</div>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="store-list">
        <div className="store-list-empty">No stores found</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`store-list ${variant === 'carousel-left' ? 'store-list-carousel-left' : ''}`}>
        {stores.map((store, index) => {
          // Determine layout based on variant and screen size
          let layout: "left" | "right" | "stacked" | "carousel-left" = "stacked";

          if (variant === 'carousel-left') {
            layout = "carousel-left";
          } else if (isDesktop) {
            layout = index % 2 === 0 ? "left" : "right";
          }

          return <StoreItem key={store.id} store={store} layout={layout} variant={variant} />;
        })}
      </div>
    </ErrorBoundary>
  );
}
