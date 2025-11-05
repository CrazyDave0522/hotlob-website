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
      // 计算最近门店
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
        className="flex w-[200px] h-10 justify-center items-center gap-2.5 rounded-tl-[30px] rounded-tr-[30px] rounded-br-none rounded-bl-[30px] bg-linear-to-r from-[#EA4148] to-[#FFA159] shadow-[3px_3px_0_0_rgba(175,23,23,0.16)] text-white text-[16px] font-normal leading-normal transition-all hover:bg-linear-to-b hover:from-[#FB8225] hover:to-[#D51D24] disabled:opacity-60"
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
