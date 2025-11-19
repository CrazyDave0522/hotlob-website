"use client";

import Image from "next/image";
import RatingStars from "../our-locations/components/rating-stars";

interface HomeStoreItemProps {
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  photos: { photo_url: string }[];
  rating: number | null;
  openingHoursWeekdayText: string[] | null;
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
}: HomeStoreItemProps) {
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
        padding: "20px",
        alignSelf: "stretch",
        borderTop: "1px solid #B9B7B7",
        borderBottom: "1px solid #B9B7B7",
      }}
    >
      {/* Store image (left) */}
      <div
        className="relative shrink-0 bg-gray-100 overflow-hidden"
        style={{
          width: "220px",
          height: "160px",
          borderRadius: "10px",
        }}
      >
        {firstPhoto ? (
          <Image
            src={firstPhoto}
            alt={name}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Store info (right) */}
      <div className="inline-flex flex-col items-start gap-4" style={{ marginLeft: "20px", flex: 1 }}>
        {/* Store Name */}
        <h3 className="text-[#1D1E1F] text-[22px] font-medium uppercase leading-normal">
          {name}
        </h3>

        {/* Rating */}
        {rating !== null && rating !== undefined && (
          <RatingStars rating={rating} />
        )}

        {/* Address */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/icons/landmark.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 aspect-square"
          />
          <span className="text-[#4E5969] text-lg font-normal leading-normal">
            {fullAddress}
          </span>
        </div>

        {/* Opening Hours (today) */}
        {todayHoursText && (
          <div className="flex items-center gap-3">
            <Image
              src="/images/icons/clock.svg"
              alt=""
              width={20}
              height={20}
              className="shrink-0 aspect-square"
            />
            <span className="text-[#4E5969] text-lg font-normal leading-normal">
              {todayHoursText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
