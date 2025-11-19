import Image from "next/image";
import HomeStoreItem from "./home-store-item";
import type { StoreWithData } from "@/lib/getStores";

interface OurLocationsSectionProps {
  stores: StoreWithData[];
}

export default function OurLocationsSection({ stores }: OurLocationsSectionProps) {
  // Display top 2 stores
  const topStores = stores.slice(0, 2);

  return (
    <section className="relative w-full" style={{ display: "block" }}>
      {/* Background image */}
      <Image
        src="/images/home-bg-locations.png"
        alt="Our locations background"
        width={1920}
        height={720}
        className="w-full h-auto"
        priority
        style={{ aspectRatio: "1920/720", display: "block" }}
      />

      {/* Content overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
        {/* Title with icon */}
        <div
          className="flex items-center"
          style={{
            marginLeft: "260px",
            marginTop: "60px",
            gap: "36px",
          }}
        >
          <Image
            src="/images/icons/store.svg"
            alt=""
            width={40}
            height={40}
          />
          <h2 className="text-[34px] font-semibold text-[#1D1E1F] leading-normal">
            Our Locations
          </h2>
        </div>

        {/* Main content: stores list (left) and review (right) */}
        <div
          className="flex items-center"
          style={{
            marginTop: "50px",
            marginLeft: "260px",
            gap: "42px",
          }}
        >
          {/* Stores list container */}
          <div
            className="flex flex-col items-start"
            style={{
              width: "690px",
            }}
          >
            {topStores.map((store) => (
              <HomeStoreItem
                key={store.id}
                name={store.name}
                street={store.street}
                suburb={store.suburb}
                state={store.state}
                postcode={store.postcode}
                photos={store.photos}
                rating={store.rating}
                openingHoursWeekdayText={store.openingHoursWeekdayText}
              />
            ))}
          </div>

          {/* Review container */}
          <div
            className="relative shrink-0"
            style={{
              width: "663px", // 1920 - 265 - 42 - 690 - 260 = 663
            }}
          >
            <Image
              src="/images/home-bg-locations-review.png"
              alt="Customer reviews"
              width={982}
              height={832}
              className="w-full h-auto"
              style={{ aspectRatio: "982/832", display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
