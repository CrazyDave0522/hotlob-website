import Image from "next/image";
import RatingStars from "./rating-stars";
import ImageWithLightbox from "@/app/components/ImageWithLightbox";

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
    <div 
      className="store-card-map shrink-0"
      style={{ 
        width: 'clamp(325px, calc(650/750*100vw), 650px)',
        height: 'clamp(160px, calc(320/750*100vw), 320px)'
      }}
    >
      {googleMapsEmbedUrl ? (
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-[20px] md:rounded-[10px] w-full h-full"
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
    <div 
      className="inline-flex flex-col items-start w-full md:w-[38.596%]"
      style={{ gap: 'clamp(8px, calc(16/750*100vw), 16px)' }}
    >
      {/* Store Name */}
      <h2 
        className="text-[#1D1E1F] font-medium uppercase leading-normal"
        style={{ fontSize: 'clamp(11px, calc(22/750*100vw), 22px)' }}
      >
        {name}
      </h2>

      {/* Rating (hide if null) */}
      {rating !== null && rating !== undefined && (
        <RatingStars rating={rating} variant="store-info" />
      )}

      {/* Address */}
      <div 
        className="flex items-center"
        style={{ gap: 'clamp(6px, calc(12/750*100vw), 12px)' }}
      >
        <Image
          src="/images/icons/landmark.svg"
          alt=""
          width={20}
          height={20}
          className="shrink-0 aspect-square"
          style={{ width: 'clamp(10px, calc(20/750*100vw), 20px)', height: 'clamp(10px, calc(20/750*100vw), 20px)' }}
        />
        <span 
          className="text-[#4E5969] font-normal leading-normal"
          style={{ fontSize: 'clamp(9px, calc(18/750*100vw), 18px)' }}
        >
          {fullAddress}
        </span>
      </div>

      {/* Opening Hours (today) - hide if missing */}
      {todayHoursText && (
        <div 
          className="flex items-center"
          style={{ gap: 'clamp(6px, calc(12/750*100vw), 12px)' }}
        >
          <Image
            src="/images/icons/clock.svg"
            alt=""
            width={20}
            height={20}
            className="shrink-0 aspect-square"
            style={{ width: 'clamp(10px, calc(20/750*100vw), 20px)', height: 'clamp(10px, calc(20/750*100vw), 20px)' }}
          />
          <span 
            className="text-[#4E5969] font-normal leading-normal"
            style={{ fontSize: 'clamp(9px, calc(18/750*100vw), 18px)' }}
          >
            {todayHoursText}
          </span>
        </div>
      )}

      {/* Store Photos (scale with viewport baseline; clamp to prevent collapse) */}
      {hasPhotos && photoCount > 0 && (
        <div 
          className="flex items-start"
          style={{ gap: 'clamp(6px, calc(12/750*100vw), 12px)' }}
        >
          {photosToShow.map((photo, index) => (
            <div
              key={`${photo.display_order}-${index}`}
              className="w-[calc((140/750)*100vw)] h-[calc((120/750)*100vw)] max-w-[140px] max-h-[120px] md:w-[clamp(64px,calc((140/1920)*100vw),140px)] md:h-auto md:max-w-none md:max-h-none md:aspect-140/120"
            >
              <ImageWithLightbox
                images={[photo.photo_url]}
                alt={`${name} - Photo ${index + 1}`}
                layout="single"
                className="w-full h-full rounded-[10px] overflow-hidden bg-gray-100"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`store-card-container flex flex-col md:flex-row md:items-start w-full ${isReversed ? 'store-card-reversed' : ''}`} style={{ gap: "clamp(10px, calc(20/750*100vw), 20px)" }}>
        {infoSection}
        {mapSection}
      </div>
      <style jsx global>{`
        @media (min-width: 768px) {
          .store-card-reversed {
            flex-direction: row-reverse;
          }
        }
        @media (min-width: 1024px) {
          .store-card-container {
            gap: clamp(20px, calc(40/1920*100vw), 40px) !important;
          }
          .store-card-map {
            width: clamp(400px, calc(800/1920*100vw), 800px) !important;
            height: clamp(170px, calc(340/1920*100vw), 340px) !important;
          }
        }
      `}</style>
    </>
  );
}
