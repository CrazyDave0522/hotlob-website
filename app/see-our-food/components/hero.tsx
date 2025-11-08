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
}

export default function Hero({
  title,
  description,
  imageUrl,
  size = "medium",
  footerNote,
  backgroundPositionY = "center",
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
      {/* 通用透明蒙层 */}
      <Image
        src="/images/overlay.png"
        alt=""
        fill
        priority
        style={{ objectFit: "cover" }}
      />

      {/* 文本区域 */}
      <div className="relative z-10 flex flex-col justify-center h-full pl-[30px] md:pl-[260px] text-white gap-5">
        <h1 
          className="text-[38px] font-semibold leading-[154%] max-w-[498px] md:max-w-[684px]"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
        >
          {title}
        </h1>
        <div 
          className="text-[30px] font-normal leading-[154%] max-w-[456px] md:max-w-[684px] space-y-5"
          style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
        >
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* 底部小字说明（可选） */}
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
