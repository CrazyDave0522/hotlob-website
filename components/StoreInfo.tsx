"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import Rating from "./Rating";
import "@/styles/components/store-info.css";

interface StoreInfoProps {
  name: string;
  rating?: number;
  address: string;
  operatingStatus?: string;
  todaysHours?: string;
  photos?: Array<{ photo_url: string }>;
  googleUrl?: string;
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
  className,
}: StoreInfoProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const displayPhotos = photos.slice(0, 3);
  const lightboxImages = photos.map((p) => p.photo_url);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setPhotoIndex(
      (photoIndex + lightboxImages.length - 1) % lightboxImages.length,
    );
  };

  const goToNext = () => {
    setPhotoIndex((photoIndex + 1) % lightboxImages.length);
  };

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

        {displayPhotos.length > 0 && (
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

      {lightboxOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "24px",
                zIndex: 10001,
              }}
              aria-label="Close lightbox"
            >
              ×
            </button>

            {/* Previous button */}
            {lightboxImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "24px",
                  zIndex: 10001,
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {/* Next button */}
            {lightboxImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "24px",
                  zIndex: 10001,
                }}
                aria-label="Next image"
              >
                ›
              </button>
            )}

            {/* Image container */}
            <div
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
              }}
            >
              <Image
                src={lightboxImages[photoIndex]}
                alt={`${name} store photo ${photoIndex + 1}`}
                width={1200}
                height={800}
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Image counter */}
            {lightboxImages.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  background: "rgba(0, 0, 0, 0.5)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  zIndex: 10001,
                }}
              >
                {photoIndex + 1} / {lightboxImages.length}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
