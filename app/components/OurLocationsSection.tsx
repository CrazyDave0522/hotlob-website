"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import HomeStoreItem from "./home-store-item";
import ReviewBubble from "./ReviewBubble";
import { SectionTitle } from "./SectionTitle";
import type { StoreWithData } from "@/lib/getStores";
import type { ReviewData } from "@/lib/getReviews";

interface OurLocationsSectionProps {
  stores: StoreWithData[];
  reviews: ReviewData[];
}

export default function OurLocationsSection({
  stores,
  reviews,
}: OurLocationsSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Display top 2 stores
  const topStores = stores.slice(0, 2);

  // Get first 4 reviews for bubbles
  const bubbleReviews = reviews.slice(0, 4);

  return (
    <section className="relative w-full" style={{ display: "block", height: isMobile ? "1200px" : "auto" }}>
      {/* Background image - conditionally rendered */}
      {isMobile ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/images/home-bg-locations.png"
            alt="Our locations background"
            width={750}
            height={2000}
            className="w-full h-full object-cover object-top"
            style={{
              transform: "rotate(90deg)",
              transformOrigin: "center"
            }}
            priority
          />
        </div>
      ) : (
        <Image
          src="/images/home-bg-locations.png"
          alt="Our locations background"
          width={1920}
          height={720}
          className="w-full h-auto"
          priority
          style={{ aspectRatio: "1920/720", display: "block" }}
        />
      )}

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          paddingLeft: isMobile ? "20px" : "min(13.542vw, 260px)", // Mobile: 20px, Desktop: 260/1920
          paddingRight: isMobile ? "20px" : "min(13.542vw, 260px)", // Mobile: 20px, Desktop: 260/1920
          paddingTop: isMobile ? "40px" : "min(3.125vw, 60px)", // Mobile: 40px, Desktop: 60/1920
          boxSizing: "border-box",
        }}
      >
        {/* Main content: desktop left-right, mobile top-bottom with center alignment */}
        <div className={isMobile ? "flex flex-col h-full items-center" : "flex h-full"} style={{ gap: isMobile ? "40px" : "min(2.188vw, 42px)" }}>
          {/* Stores section - always on top, centered on mobile */}
          {isMobile ? (
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[690px]">
                {/* Title with icon */}
                <div
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <SectionTitle
                    className="text-left mt-0 mb-0"
                    icon={{
                      src: "/images/icons/store.svg",
                      alt: "Store icon",
                      width: 32,
                      height: 32
                    }}
                  >
                    Our Locations
                  </SectionTitle>
                </div>

                {/* Stores list */}
                <div
                  style={{
                    display: 'flex',
                    width: '690px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '20px'
                  }}
                >
                  {topStores.map((store, index) => (
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
                      isLast={index === topStores.length - 1}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col" style={{ width: "min(35.938vw, 690px)" }}>
              {/* Title with icon */}
              <div
                style={{
                  marginBottom: "min(2.604vw, 50px)",
                }}
              >
                <SectionTitle
                  className="text-left mt-0 mb-0"
                  icon={{
                    src: "/images/icons/store.svg",
                    alt: "Store icon",
                    width: 40,
                    height: 40
                  }}
                >
                  Our Locations
                </SectionTitle>
              </div>

              {/* Stores list */}
              <div className="flex flex-col items-start">
                {topStores.map((store, index) => (
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
                    isLast={index === topStores.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviews section - desktop right, mobile bottom */}
          <div 
            className={isMobile ? "relative" : "flex-1 relative"} 
            style={{ 
              ...(isMobile && {
                width: '693px',
                height: '603px',
                flexShrink: 0
              })
            }}
          >
            {isMobile ? (
              <Image
                src="/images/home-bg-locations-review-mb.png"
                alt="Customer reviews"
                width={750}
                height={826}
                className="w-full h-full object-contain"
                priority
              />
            ) : (
              <Image
                src="/images/home-bg-locations-review.png"
                alt="Customer reviews"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="object-contain"
              />
            )}

            {/* Review bubbles overlaid on image */}
            {bubbleReviews.length >= 4 && (
              <>
                <ReviewBubble review={bubbleReviews[0]} position="top" />
                <ReviewBubble review={bubbleReviews[1]} position="right" />
                <ReviewBubble review={bubbleReviews[2]} position="bottom" />
                <ReviewBubble review={bubbleReviews[3]} position="left" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
