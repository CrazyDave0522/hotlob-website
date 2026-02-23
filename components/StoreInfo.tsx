"use client";

import React, { useState } from "react";
import ImageLightbox from "./ImageLightbox";
import Link from "next/link";
import Image from "next/image";
import Rating from "./Rating";
import "@/styles/components/store/store-info.css";

interface StoreInfoProps {
  name: string;
  rating?: number;
  address: string;
  operatingStatus?: string;
  todaysHours?: string;
  photos?: Array<{ photo_url: string }>;
  googleUrl?: string;
  variant?: 'alternating' | 'carousel-left';
  className?: string;
}

export default function StoreInfo({
  name,
  rating,
  address,
  operatingStatus,
  todaysHours,
  photos = [],
  googleUrl,
  variant,
  className,
}: StoreInfoProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const displayPhotos = photos.slice(0, 3);
  const lightboxImages = photos.map((p) => p.photo_url);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Navigation is handled inside ImageLightbox

  return (
    <div className={`store-info ${className || ""}`} data-testid="store-info">
      <div className="store-info-header">
        <h3 className="store-info-title">{name}</h3>
        {rating && <Rating value={rating} size="md" />}
      </div>

      <div className="store-info-details">
        <div className="store-info-address">
          <Image
            src="/images/icons/landmark.svg"
            alt=""
            width={16}
            height={16}
            className="store-info-icon"
          />
          {googleUrl ? (
            <Link
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="store-info-address-link"
            >
              {address}
            </Link>
          ) : (
            <span>{address}</span>
          )}
        </div>

        {operatingStatus && todaysHours && (
          <div className="store-info-hours">
            <Image
              src="/images/icons/clock.svg"
              alt=""
              width={16}
              height={16}
              className="store-info-icon"
            />
            <span className="store-info-status">{operatingStatus}</span>
            <span className="store-info-hours-text">{todaysHours}</span>
          </div>
        )}

        {displayPhotos.length > 0 && variant !== 'carousel-left' && (
          <div className="store-info-photos">
            {displayPhotos.map((photo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openLightbox(index)}
                className="store-info-photo-button"
                aria-label={`View ${name} store photo ${index + 1}`}
              >
                <Image
                  src={photo.photo_url}
                  alt={`${name} store photo ${index + 1}`}
                  width={140}
                  height={120}
                  className="store-info-photo"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={photoIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
