"use client";

import StoreSelectionModal, { type StoreInfo } from "./StoreSelectionModal";
import { useOrderFlow } from "@/app/hooks/useOrderFlow";

export function NavOrderOnlineButton() {
  const { stores, modalOpen, setModalOpen, locating, userLoc, handleOrderClick } = useOrderFlow();

  return (
    <>
      <button
        onClick={handleOrderClick}
        disabled={locating}
        className="button-click flex items-center justify-center bg-[#EA4148] text-[clamp(11px,0.677vw,13px)] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#C71E25] disabled:opacity-60"
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