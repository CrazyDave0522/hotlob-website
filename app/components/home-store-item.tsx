"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import RatingStars from "../our-locations/components/rating-stars";
import ImageWithLightbox from "./ImageWithLightbox";

interface HomeStoreItemProps {
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  photos: { photo_url: string }[];
  rating: number | null;
  openingHoursWeekdayText: string[] | null;
  isLast?: boolean;
  index?: number;
}

export default function HomeStoreItem({
  name,
  street,
  suburb,
  state,
  postcode,
  photos,
  rating,
  openingHoursWeekdayText,
  isLast = false,
  index = 0,
}: HomeStoreItemProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fullAddress = `${street}, ${suburb} ${state} ${postcode}`;
  const firstPhoto = photos.length > 0 ? photos[0].photo_url : null;

  // Compute today's hours text
  let todayHoursText: string | null = null;
  if (openingHoursWeekdayText && openingHoursWeekdayText.length >= 7) {
    const d = new Date().getDay(); // 0=Sun..6=Sat
    const idx = d === 0 ? 6 : d - 1; // Map to 0=Mon..6=Sun
    const line = openingHoursWeekdayText[idx] ?? "";
    const parts = line.split(": ");
    const text = parts.length > 1 ? parts.slice(1).join(": ") : "";
    if (text) {
      todayHoursText = `Today: ${text}`;
    }
  }

  return (
    <div
      className="flex justify-between items-center"
      style={{
        padding: "min(1.042vw, 20px)", // 20/1920
        alignSelf: "stretch",
        ...(isMobile
          ? {
              // Mobile: conditional borders and padding
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
              ...(index === 0 && { paddingBottom: "30px" }), // First item has bottom padding
              ...(index !== 0 &&
                index !== 1 && { borderTop: "1px solid #B9B7B7" }), // No top border for first and second items
              ...(!isLast &&
                index !== 1 && { borderBottom: "1px solid #B9B7B7" }), // No bottom border for last and second items
            }
          : {
              // Desktop: original borders
              borderTop: "1px solid #B9B7B7",
              ...(isLast && { borderBottom: "1px solid #B9B7B7" }),
            }),
      }}
    >
      {/* Store image (left) */}
      <div
        className="relative shrink-0 bg-gray-100 overflow-hidden"
        style={{
          width: isMobile ? "220px" : "min(11.458vw, 220px)", // Mobile: 220px fixed, Desktop: responsive max 220px
          height: isMobile ? "160px" : "min(8.333vw, 160px)", // Mobile: 160px fixed, Desktop: responsive max 160px
          borderRadius: "min(0.521vw, 10px)", // 10/1920
        }}
      >
        {firstPhoto ? (
          <ImageWithLightbox
            images={[firstPhoto]}
            alt={name}
            layout="single"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Store info (right) */}
      <div
        className="inline-flex flex-col items-start"
        style={{
          marginLeft: isMobile ? "20px" : "min(1.042vw, 20px)",
          flex: 1,
          gap: isMobile ? "20px" : "16px", // Mobile: 20px, Desktop: 16px
        }}
      >
        {/* Store Name */}
        <h3
          className="text-[#1D1E1F] font-medium uppercase leading-normal"
          style={{ fontSize: isMobile ? "22px" : "min(1.146vw, 22px)" }}
        >
          {name}
        </h3>

        {/* Rating */}
        {rating !== null && rating !== undefined && (
          <RatingStars rating={rating} />
        )}

        {/* Address */}
        <div
          className="flex items-center"
          style={{ gap: "min(0.833vw, 16px)" }}
        >
          <Image
            src="/images/icons/landmark.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 aspect-square"
          />
          <span
            className="text-[#4E5969] font-normal leading-normal"
            style={{ fontSize: isMobile ? "18px" : "min(0.938vw, 18px)" }}
          >
            {fullAddress}
          </span>
        </div>

        {/* Opening Hours (today) */}
        {todayHoursText && (
          <div
            className="flex items-center"
            style={{ gap: "min(0.833vw, 16px)" }}
          >
            <Image
              src="/images/icons/clock.svg"
              alt=""
              width={20}
              height={20}
              className="shrink-0 aspect-square"
            />
            <span
              className="text-[#4E5969] font-normal leading-normal"
              style={{ fontSize: isMobile ? "18px" : "min(0.938vw, 18px)" }}
            >
              {todayHoursText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
