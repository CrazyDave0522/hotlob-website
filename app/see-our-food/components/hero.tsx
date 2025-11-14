// app/see-our-food/components/hero.tsx
"use client";

import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  size?: "large" | "medium"; // large = 820px (Home), medium = 420px (others)
  footerNote?: string; // optional small text at the bottom-left inside hero
  backgroundPositionY?: string; // optional vertical position (default "center")
  showOverlay?: boolean; // optional overlay toggle (default true)
}

export default function Hero({
  title,
  description,
  imageUrl,
  size = "medium",
  footerNote,
  backgroundPositionY = "center",
  showOverlay = true,
}: HeroProps) {
  const heroHeight = size === "large" ? "h-[820px]" : "h-[420px]";

  return (
    <section
      className={`relative w-full overflow-hidden ${heroHeight}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: `center ${backgroundPositionY}`,
      }}
    >
      {/* General transparent overlay */}
      {showOverlay && (
        <Image
          src="/images/overlay.png"
          alt=""
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      )}

      {/* Text area */}
      <div className={`relative z-10 flex flex-col justify-center h-full pl-[30px] md:pl-[260px] gap-5 ${showOverlay ? 'text-white' : ''}`}>
        <h1 
          className={`font-semibold max-w-[498px] md:max-w-[684px] ${showOverlay ? 'text-[38px] leading-[154%]' : 'text-[30px] leading-normal text-[#242424]'}`}
          style={showOverlay ? { textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' } : {}}
        >
          {title}
        </h1>
        <div 
          className={`font-normal max-w-[456px] md:max-w-[684px] space-y-5 ${showOverlay ? 'text-[30px] leading-[154%]' : 'text-[20px] leading-normal text-[#999]'}`}
          style={showOverlay ? { textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' } : {}}
        >
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Footer note (optional) */}
      {footerNote && (
        <div className="absolute z-10 bottom-2.5 left-[30px] md:left-[260px]">
          <p className="text-[#C9CDD4] text-[14px] font-normal leading-none text-left">
            {footerNote}
          </p>
        </div>
      )}
    </section>
  );
}
