"use client";

import { useState, useCallback } from "react";
import StoreSelectionModal, { StoreInfo } from "./StoreSelectionModal";
import { getStoresBasic } from "@/lib/getStores";
import { getCurrentPositionWithTimeout, haversineDistance } from "@/lib/utils/geo";

export function NavOrderOnlineButton() {
  const [stores, setStores] = useState<StoreInfo[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const handleOrderClick = useCallback(async () => {
    // Lazy load stores if not loaded yet
    if (!stores) {
      try {
        const all = await getStoresBasic({ includeExtendedInfo: true });
        const simplified: StoreInfo[] = all.map(s => ({
          id: s.id,
          name: s.name,
          uber_url: s.uber_url,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
        setStores(simplified);
      } catch (e) {
        console.error("Failed to load stores", e);
        // Show modal (empty) instead of ORDER_URL fallback per new requirement
        setModalOpen(true);
        return;
      }
    }
    const availableStores = stores || [];
    if (availableStores.length === 0) {
      // No stores data — open modal (will be empty) for consistency
      setModalOpen(true);
      return;
    }
    setLocating(true);
    try {
      const pos = await getCurrentPositionWithTimeout(5000);
      const { latitude, longitude } = pos.coords;
      setUserLoc({ lat: latitude, lng: longitude });
      // Find nearest store with uber_url
      const sorted = [...availableStores].sort((a, b) => {
        const d1 = (a.latitude && a.longitude) ? haversineDistance(latitude, longitude, a.latitude, a.longitude) : Infinity;
        const d2 = (b.latitude && b.longitude) ? haversineDistance(latitude, longitude, b.latitude, b.longitude) : Infinity;
        return d1 - d2;
      });
      const nearest = sorted.find(s => !!s.uber_url);
      if (nearest?.uber_url) {
        window.open(nearest.uber_url, "_blank");
      } else {
        setModalOpen(true);
      }
    } catch {
      // Geolocation failure => open modal for manual selection
      setModalOpen(true);
    } finally {
      setLocating(false);
    }
  }, [stores]);

  return (
    <>
      <button
        onClick={handleOrderClick}
        disabled={locating}
        className="flex items-center justify-center bg-[#EA4148] text-[clamp(11px,0.677vw,13px)] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#C71E25] disabled:opacity-60"
        style={{
          width: "min(6.25vw, 120px)",
          height: "min(1.667vw, 32px)",
          borderRadius: "min(1.042vw, 20px)",
        }}
        aria-label="Order Online"
      >
        {locating ? "Locating..." : "Order Online"}
      </button>
      <StoreSelectionModal
        stores={(stores || []).filter((s: StoreInfo) => !!s.uber_url)}
        userLocation={userLoc}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}