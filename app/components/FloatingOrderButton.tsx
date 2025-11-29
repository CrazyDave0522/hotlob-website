"use client";

import React from "react";
import { useOrderFlow } from "@/app/hooks/useOrderFlow";
import StoreSelectionModal, { type StoreInfo } from "./StoreSelectionModal";

export default function FloatingOrderButton() {
  const {
    stores,
    modalOpen,
    setModalOpen,
    locating,
    userLoc,
    handleOrderClick,
  } = useOrderFlow();

  return (
    <>
      <div className="lg:hidden fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2">
        <button
          onClick={handleOrderClick}
          disabled={locating}
          aria-label="Order Online"
          className="floating-order-button button-click"
        >
          {locating ? "Locating..." : "Order Online"}
        </button>
      </div>

      <StoreSelectionModal
        stores={(stores || []).filter((s: StoreInfo) => !!s.uber_url)}
        userLocation={userLoc}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
