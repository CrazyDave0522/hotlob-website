import React from "react";
import Image from "next/image";
import GoogleMapEmbed from "./GoogleMapEmbed";
import StoreInfo from "./StoreInfo";
import { StoreImageCarousel } from "./StoreImageCarousel";
import type { Store, StorePhoto } from "@/types/store";
import "@/styles/components/store-item.css";

interface StoreItemProps {
  store: Store & { photos?: StorePhoto[] };
  layout: "left" | "right" | "stacked" | "carousel-left";
  variant?: 'alternating' | 'carousel-left';
  className?: string;
}

export default function StoreItem({
  store,
  layout,
  variant,
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
      uberUrl={store.uber_url}
      variant={variant}
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

  if (layout === "carousel-left") {
    const uberElement = store.uber_url ? (
      <div className="store-item-angle">
        <a
          href={store.uber_url}
          target="_blank"
          rel="noopener noreferrer"
          className="store-info-uber-link"
          aria-label={`Get directions to ${store.name} on Uber`}
        >
          <Image
            src="/images/icons/angle-right-black.svg"
            alt=""
            width={32}
            height={32}
            className="store-info-uber-icon"
          />
        </a>
      </div>
    ) : null;

    return (
      <div
        className={`store-item store-item-carousel-left ${className || ""}`}
        data-testid="store-item"
        role="region"
        aria-label="Store item"
      >
        <div className="store-item-carousel">
          <StoreImageCarousel
            photos={store.photos || []}
            storeName={store.name}
          />
        </div>
        <div className="store-item-info">
          <StoreInfo
            name={store.name}
            rating={store.google_rating || undefined}
            address={address}
            operatingStatus={operatingStatus}
            todaysHours={todaysHours}
            photos={store.photos}
            googleUrl={store.google_url}
            variant={variant}
          />
        </div>
        {uberElement}
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
