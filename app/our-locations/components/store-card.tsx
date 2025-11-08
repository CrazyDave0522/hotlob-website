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
  isReversed = false,
}: StoreCardProps) {
  const fullAddress = `${street}, ${suburb} ${state} ${postcode}`;
  const hasPhotos = photos.length > 0;

  // Map component
  const mapSection = (
    <div className="w-[800px] h-[340px] shrink-0">
      {googleMapsEmbedUrl ? (
        <iframe
          src={googleMapsEmbedUrl}
          width="800"
          height="340"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-[10px]"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-[10px] flex items-center justify-center">
          <p className="text-gray-400">Map not available</p>
        </div>
      )}
    </div>
  );

  // Store info component
  const infoSection = (
    <div className="inline-flex flex-col items-start gap-4 w-[528px]">
      {/* Store Name */}
      <h2 className="text-[#1D1E1F] text-[22px] font-medium uppercase leading-normal">
        {name}
      </h2>

      {/* Rating Placeholder */}
      <RatingStars rating={4.5} totalReviews={123} />

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

      {/* Opening Hours Placeholder */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/icons/clock.svg"
          alt=""
          width={20}
          height={20}
          className="shrink-0 aspect-square"
        />
        <span className="text-[#4E5969] text-lg font-normal leading-normal">
          Mon-Sun: 11:00 AM - 9:00 PM
        </span>
      </div>

      {/* Store Photos */}
      {hasPhotos && (
        <div className="flex items-start gap-[30px]">
          {photos.map((photo, index) => (
            <div
              key={`${photo.display_order}-${index}`}
              className="relative w-[140px] h-[120px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0"
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
    <div className="flex items-start gap-10 mx-auto" style={{ maxWidth: '1368px' }}>
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
