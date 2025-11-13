"use client";

import { useState } from "react";
import {
  getCurrentPositionWithTimeout,
  haversineDistance,
} from "@/lib/utils/geo";
import StoreSelectionModal, { StoreInfo } from "./store-selection-modal";

interface OrderButtonProps {
  stores?: StoreInfo[];
  fallbackUrl: string;
}

export default function OrderButton({ stores, fallbackUrl }: OrderButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleClick = async () => {
    if (!stores || stores.length === 0) {
      window.open(fallbackUrl, "_blank");
      return;
    }
    setLocating(true);
    try {
      const pos = await getCurrentPositionWithTimeout(5000);
      const { latitude, longitude } = pos.coords;
      // Calculate nearest store
      const sorted = [...stores].sort((a, b) => {
        const d1 =
          a.latitude && a.longitude
            ? haversineDistance(latitude, longitude, a.latitude, a.longitude)
            : Infinity;
        const d2 =
          b.latitude && b.longitude
            ? haversineDistance(latitude, longitude, b.latitude, b.longitude)
            : Infinity;
        return d1 - d2;
      });
      const nearest = sorted[0];
      if (nearest && nearest.uber_url) {
        window.open(nearest.uber_url, "_blank");
      } else {
        setModalOpen(true);
      }
    } catch {
      setModalOpen(true);
    } finally {
      setLocating(false);
    }
  };

  return (
    <>
      <button
        className="order-button-base order-button-default"
        onClick={handleClick}
        disabled={locating}
      >
        Order Now
      </button>
      <StoreSelectionModal
        stores={stores || []}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
