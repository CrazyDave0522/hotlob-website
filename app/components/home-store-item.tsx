"use client";

import Image from "next/image";
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
  google_url?: string | null;
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
  google_url,
}: HomeStoreItemProps) {
  // Responsive handled purely via CSS media queries (mobile-first)

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
      className={`home-store-item flex justify-between items-center ${
        isLast ? "last-item" : ""
      } ${index === 0 ? "first-item" : ""} ${index === 1 ? "second-item" : ""}`}
    >
      {/* Store image (left) */}
      <div className="relative shrink-0 bg-gray-100 overflow-hidden home-store-image">
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

      {/* Store info (center) */}
      <div className="home-store-item-info inline-flex flex-col items-start flex-1">
        {/* Store Name */}
        <h3 className="home-store-item-title text-[#1D1E1F] font-medium uppercase leading-normal">
          {name}
        </h3>

        {/* Rating */}
        {rating !== null && rating !== undefined && (
          <RatingStars rating={rating} variant="store-info" />
        )}

        {/* Address */}
        <div className="flex items-center home-store-item-row">
          <Image
            src="/images/icons/landmark.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 aspect-square"
          />
          <span className="home-store-item-text text-[#4E5969] font-normal leading-normal">
            {fullAddress}
          </span>
        </div>

        {/* Opening Hours (today) */}
        {todayHoursText && (
          <div className="flex items-center home-store-item-row">
            <Image
              src="/images/icons/clock.svg"
              alt=""
              width={20}
              height={20}
              className="shrink-0 aspect-square"
            />
            <span className="home-store-item-text text-[#4E5969] font-normal leading-normal">
              {todayHoursText}
            </span>
          </div>
        )}
      </div>

      {/* Arrow icon (right) - only show if google_url exists */}
      {google_url && (
        <a
          href={google_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-4 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label={`Open ${name} in Google Maps`}
        >
          <Image
            src="/images/icons/angle-right-black.svg"
            alt="Open in Google Maps"
            width={32}
            height={32}
            className="home-store-item-arrow"
          />
        </a>
      )}
    </div>
  );
}
