import Image from "next/image";
import RatingStars from "./rating-stars";

interface StorePhoto {
  photo_url: string;
  display_order: number;
}

interface StoreCardProps {
  name: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  googleMapsEmbedUrl: string | null;
  photos: StorePhoto[];
  rating?: number | null; // from place_cache.rating
  openingHoursWeekdayText?: string[]; // 7-day weekday_text from Google Places
  isReversed?: boolean; // true for even-indexed stores (info left, map right)
}

export default function StoreCard({
  name,
  street,
  suburb,
  state,
  postcode,
  googleMapsEmbedUrl,
  photos,
  rating = null,
  openingHoursWeekdayText,
  isReversed = false,
}: StoreCardProps) {
  const fullAddress = `${street}, ${suburb} ${state} ${postcode}`;
  const hasPhotos = photos.length > 0;
  
  // Compute today's hours text on the server (timezone differences are acceptable per requirements)
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

  // Map component (proportional: 800/1368 = 58.479%)
  const mapSection = (
    <div className="shrink-0" style={{ width: "58.479%", aspectRatio: "800 / 340" }}>
      {googleMapsEmbedUrl ? (
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-[10px] w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-[10px] flex items-center justify-center">
          <p className="text-gray-400">Map not available</p>
        </div>
      )}
    </div>
  );

  // Store info component (proportional: 528/1368 = 38.596%)
  // Photos: show up to 3 and compute proportional widths inside the info column
  const photosToShow = photos.slice(0, 3);
  const photoCount = photosToShow.length;
  // Photos will use clamp() tied to the 1920px design baseline

  const infoSection = (
    <div className="inline-flex flex-col items-start gap-4" style={{ width: "38.596%" }}>
      {/* Store Name */}
      <h2 className="text-[#1D1E1F] text-[22px] font-medium uppercase leading-normal">
        {name}
      </h2>

      {/* Rating (hide if null) */}
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

      {/* Opening Hours (today) - hide if missing */}
      {todayHoursText && (
        <div className="flex items-center gap-3">
          <Image
            src="/images/icons/clock.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 aspect-square"
          />
          <span className="text-[#4E5969] text-lg font-normal leading-normal">{todayHoursText}</span>
        </div>
      )}

      {/* Store Photos (scale with viewport baseline; clamp to prevent collapse) */}
      {hasPhotos && photoCount > 0 && (
        <div
          className="flex items-start"
          style={{ gap: `clamp(8px, calc((30 / 1920) * 100vw), 30px)` }}
        >
          {photosToShow.map((photo, index) => (
            <div
              key={`${photo.display_order}-${index}`}
              className="relative rounded-[10px] overflow-hidden bg-gray-100 shrink-0"
              style={{ width: `clamp(64px, calc((140 / 1920) * 100vw), 140px)`, aspectRatio: "140 / 120" }}
            >
              <Image
                src={photo.photo_url}
                alt={`${name} - Photo ${index + 1}`}
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-start" style={{ width: "100%", columnGap: "2.924%" }}>
      {isReversed ? (
        <>
          {infoSection}
          {mapSection}
        </>
      ) : (
        <>
          {mapSection}
          {infoSection}
        </>
      )}
    </div>
  );
}
