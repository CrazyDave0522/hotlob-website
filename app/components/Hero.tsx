// app/components/Hero.tsx
"use client";

import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string; // optional mobile-specific image
  size?: "home" | "large" | "medium"; // home = 820px, large = 820px, medium = 420px
  footerNote?: string; // optional small text at the bottom-left inside hero
  backgroundPositionY?: string; // optional vertical position (default "center")
  backgroundPositionX?: string; // optional horizontal position (default "center")
  showOverlay?: boolean; // optional overlay toggle (default true)
  overlayUrl?: string; // optional custom overlay image
}

export default function Hero({
  title,
  description,
  imageUrl,
  mobileImageUrl,
  size = "medium",
  footerNote,
  backgroundPositionY = "center",
  backgroundPositionX = "center",
  showOverlay = true,
  overlayUrl,
}: HeroProps) {
  // home and large use 820px (42.708vw capped at 820px); medium uses 420px (21.875vw capped at 420px)
  const heroHeight =
    size === "medium" ? "min(21.875vw, 420px)" : "min(42.708vw, 820px)";

  return (
    <>
      {/* Mobile Hero — visible below 1024px */}
      <section
        className="lg:hidden relative w-full overflow-hidden hero-mobile"
        style={{
          backgroundImage: `url(${mobileImageUrl || imageUrl})`,
          backgroundPositionX: backgroundPositionX,
          backgroundPositionY: backgroundPositionY,
        }}
      >
        {/* General transparent overlay */}
        {showOverlay && (
          <Image
            src={overlayUrl ?? "/images/overlay-mb.png"}
            alt=""
            fill
            priority
            className="object-cover"
          />
        )}

        {/* Text area */}
        <div className="relative z-10 flex flex-col justify-center h-full hero-mobile-padding-left">
          <div className="flex flex-col gap-5 hero-content-max-width">
            <h1
              className={`font-semibold leading-[154%] ${showOverlay ? "text-white" : "text-[#242424]"} hero-title-mobile-size ${showOverlay ? "hero-text-shadow" : ""}`}
            >
              {title}
            </h1>
            <div
              className={`font-normal leading-[154%] space-y-2 ${showOverlay ? "text-white" : "text-[#999]"} hero-body-mobile-size ${showOverlay ? "hero-text-shadow" : ""}`}
            >
              {description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note (optional) */}
        {footerNote && (
          <div className="absolute z-10 bottom-2.5 left-0 hero-footer-mobile-padding">
            <p className="text-[#C9CDD4] text-[14px] font-normal leading-none text-left">
              {footerNote}
            </p>
          </div>
        )}
      </section>

      {/* Desktop Hero — visible at 1024px and above */}
      <section
        className="hidden lg:block relative w-full overflow-hidden hero-desktop"
        style={{
          height: heroHeight,
          backgroundImage: `url(${imageUrl})`,
          backgroundPositionX: backgroundPositionX,
          backgroundPositionY: backgroundPositionY,
        }}
      >
        {/* General transparent overlay */}
        {showOverlay && (
          <Image
            src={overlayUrl ?? "/images/overlay.png"}
            alt=""
            fill
            priority
            className="object-cover"
          />
        )}

        {/* Text area */}
        <div className={`relative z-10 flex flex-col justify-center h-full gap-5 ${showOverlay ? "text-white" : ""} hero-desktop-padding-left`}>
          <h1
            className={`font-semibold ${showOverlay ? "leading-[154%]" : "leading-normal text-[#242424]"} hero-title-desktop-size hero-content-max-width ${showOverlay ? "hero-text-shadow" : ""}`}
          >
            {title}
          </h1>
          <div
            className={`font-normal space-y-2 ${showOverlay ? "leading-[154%]" : "leading-normal text-[#999]"} hero-body-desktop-size hero-content-max-width ${showOverlay ? "hero-text-shadow" : ""}`}
          >
            {description.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Footer note (optional) */}
        {footerNote && (
          <div className="absolute z-10 bottom-2.5 right-0 hero-footer-desktop-padding">
            <p className="text-[#C9CDD4] text-[12px] font-normal leading-none text-right">
              {footerNote}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
