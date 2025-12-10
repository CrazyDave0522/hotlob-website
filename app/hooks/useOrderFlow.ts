"use client";

import { useCallback, useState } from "react";
import { getStoresBasic } from "@/lib/getStores";
import type { Store } from "@/lib/getStores";
import { getCurrentPositionWithTimeout, haversineDistance } from "@/lib/utils/geo";
import type { StoreInfo } from "@/app/components/StoreSelectionModal";

export function useOrderFlow() {
  const [stores, setStores] = useState<StoreInfo[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const handleOrderClick = useCallback(async () => {
    // Lazy load stores if not loaded yet
    let availableStores: StoreInfo[] = stores || [];
    if (!stores) {
      try {
        const all = await getStoresBasic({ includeExtendedInfo: true });
        const simplified: StoreInfo[] = all.map((s: Store) => ({
          id: s.id,
          name: s.name,
          uber_url: s.uber_url,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
        setStores(simplified);
        availableStores = simplified;
      } catch (e) {
        // If stores fail to load - open modal (empty fallback)
        console.error("Failed to load stores", e);
        setModalOpen(true);
        return;
      }
    }

    if (availableStores.length === 0) {
      setModalOpen(true);
      return;
    }

    setLocating(true);
    try {
      const pos = await getCurrentPositionWithTimeout(5000);
      const { latitude, longitude } = pos.coords;
      setUserLoc({ lat: latitude, lng: longitude });

      const sorted = [...availableStores].sort((a, b) => {
        const d1 = a.latitude && a.longitude ? haversineDistance(latitude, longitude, a.latitude, a.longitude) : Infinity;
        const d2 = b.latitude && b.longitude ? haversineDistance(latitude, longitude, b.latitude, b.longitude) : Infinity;
        return d1 - d2;
      });
      const nearest = sorted.find((s) => !!s.uber_url);
      if (nearest?.uber_url) {
        window.open(nearest.uber_url, "_blank");
      } else {
        setModalOpen(true);
      }
    } catch (e) {
      // Geolocation failure => open modal for manual selection
      console.error('Geolocation failed', e);
      setModalOpen(true);
    } finally {
      setLocating(false);
    }
  }, [stores]);

  return { stores, modalOpen, setModalOpen, locating, userLoc, handleOrderClick } as const;
}
