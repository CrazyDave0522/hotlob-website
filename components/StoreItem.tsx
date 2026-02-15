import React from "react";
import GoogleMapEmbed from "./GoogleMapEmbed";
import StoreInfo from "./StoreInfo";
import type { Store, StorePhoto } from "@/types/store";
import "@/styles/components/store-item.css";

interface StoreItemProps {
  store: Store & { photos?: StorePhoto[] };
  layout: "left" | "right" | "stacked";
  className?: string;
}

export default function StoreItem({
  store,
  layout,
  className,
}: StoreItemProps) {
  const address = [store.street, store.suburb, store.state, store.postcode]
    .filter(Boolean)
    .join(", ");

  const operatingStatus = store.google_trading_hours?.open_now
    ? "Open"
    : "Closed";
  const todaysHours =
    store.google_trading_hours?.weekday_text?.[(new Date().getDay() + 6) % 7];

  const mapElement = store.google_maps_embed_url ? (
    <GoogleMapEmbed embedUrl={store.google_maps_embed_url} />
  ) : null;

  const infoElement = (
    <StoreInfo
      name={store.name}
      rating={store.google_rating || undefined}
      address={address}
      operatingStatus={operatingStatus}
      todaysHours={todaysHours}
      photos={store.photos}
      googleUrl={store.google_url}
    />
  );

  if (layout === "stacked") {
    return (
      <div
        className={`store-item store-item-stacked ${className || ""}`}
        data-testid="store-item"
        role="region"
        aria-label="Store item"
      >
        {infoElement}
        {mapElement}
      </div>
    );
  }

  return (
    <div
      className={`store-item store-item-alternating ${className || ""}`}
      data-testid="store-item"
      role="region"
      aria-label="Store item"
    >
      {layout === "left" ? (
        <>
          {mapElement}
          {infoElement}
        </>
      ) : (
        <>
          {infoElement}
          {mapElement}
        </>
      )}
    </div>
  );
}
