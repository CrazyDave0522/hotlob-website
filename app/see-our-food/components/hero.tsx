// app/see-our-food/components/hero.tsx
"use client";

import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  size?: "home" | "large" | "medium"; // home = 820px, large = 820px, medium = 420px
  footerNote?: string; // optional small text at the bottom-left inside hero
  backgroundPositionY?: string; // optional vertical position (default "center")
  showOverlay?: boolean; // optional overlay toggle (default true)
  overlayUrl?: string; // optional custom overlay image
}

export default function Hero({
  title,
  description,
  imageUrl,
  size = "medium",
  footerNote,
  backgroundPositionY = "center",
  showOverlay = true,
  overlayUrl,
}: HeroProps) {
  // home and large use 820px (42.708vw capped at 820px); medium uses 420px (21.875vw capped at 420px)
  const heroHeight = size === "medium" 
    ? "min(21.875vw, 420px)" 
    : "min(42.708vw, 820px)";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: heroHeight,
        paddingTop: "min(4.167vw, 80px)", // Add top padding for sticky header
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPositionX: "center",
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
          style={{ objectFit: "cover" }}
        />
      )}

      {/* Text area */}
      <div 
        className={`relative z-10 flex flex-col justify-center h-full gap-5 ${showOverlay ? 'text-white' : ''}`}
        style={{ paddingLeft: "min(13.542vw, 260px)" }} // 260/1920 = 13.542%
      >
        <h1 
          className={`font-semibold ${showOverlay ? 'text-[38px] leading-[154%]' : 'text-[30px] leading-normal text-[#242424]'}`}
          style={{
            maxWidth: "min(35.625vw, 684px)", // 684/1920 = 35.625%
            ...(showOverlay ? { textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' } : {})
          }}
        >
          {title}
        </h1>
        <div 
          className={`font-normal space-y-2 ${showOverlay ? 'text-[30px] leading-[154%]' : 'text-[20px] leading-normal text-[#999]'}`}
          style={{
            maxWidth: "min(35.625vw, 684px)", // 684/1920 = 35.625%
            ...(showOverlay ? { textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' } : {})
          }}
        >
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Footer note (optional) */}
      {footerNote && (
        <div 
          className="absolute z-10 bottom-2.5 right-0" 
          style={{ paddingRight: "min(8.333vw, 160px)" }} // 160/1920 = 8.333%, closer to right edge
        >
          <p className="text-[#C9CDD4] text-[14px] font-normal leading-none text-right">
            {footerNote}
          </p>
        </div>
      )}
    </section>
  );
}
