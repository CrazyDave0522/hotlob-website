"use client";

import { useState } from "react";
import {
  getCurrentPositionWithTimeout,
  haversineDistance,
} from "@/lib/utils/geo";
import StoreSelectionModal, { StoreInfo } from "@/app/components/StoreSelectionModal";

interface OrderButtonProps {
  stores?: StoreInfo[];
  fallbackUrl: string;
}

export default function OrderButton({ stores, fallbackUrl }: OrderButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
      {/* Mobile button */}
      <button
        className="button-click order-button-mobile md:hidden"
        onClick={handleClick}
        disabled={locating}
        style={{
          background: locating ? 'rgba(234, 65, 72, 0.6)' : (isPressed ? 'linear-gradient(180deg, #fb8225 0%, #d51d24 100%)' : 'linear-gradient(90deg, #ea4148 0%, #ffa159 100%)'),
          boxShadow: isPressed ? '5px 5px 0 0 rgba(175, 23, 23, 0.24)' : '3px 3px 0 0 rgba(175, 23, 23, 0.16)',
          cursor: locating ? 'not-allowed' : 'pointer',
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        Order Now
      </button>
      {/* Desktop button */}
      <button
        className="button-click order-button-base order-button-default hidden md:flex"
        onClick={handleClick}
        disabled={locating}
        style={{
          background: locating ? 'rgba(234, 65, 72, 0.6)' : (isPressed ? 'linear-gradient(180deg, #fb8225 0%, #d51d24 100%)' : 'linear-gradient(90deg, #ea4148 0%, #ffa159 100%)'),
          boxShadow: isPressed ? '5px 5px 0 0 rgba(175, 23, 23, 0.24)' : '3px 3px 0 0 rgba(175, 23, 23, 0.16)',
          cursor: locating ? 'not-allowed' : 'pointer',
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
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
