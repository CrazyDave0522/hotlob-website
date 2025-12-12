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
        className="button-click flex items-center justify-center bg-[#EA4148] text-[clamp(11px,0.677vw,13px)] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#C71E25] disabled:opacity-60 nav-order-button-size"
        aria-label="Order Online"
      >
        {locating ? "Locating..." : "Order Online"}
      </button>
      <StoreSelectionModal
        stores={(stores || []).filter((s: StoreInfo) => !!s.uber_url)}
        userLocation={userLoc}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStoreSelect={(store) => {
          if (store.uber_url) {
            window.open(store.uber_url, "_blank");
          }
          setModalOpen(false);
        }}
      />
    </>
  );
}