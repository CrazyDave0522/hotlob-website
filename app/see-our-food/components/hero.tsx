// app/see-our-food/components/hero.tsx
"use client";

import React from "react";
import Image from "next/image";

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  size?: "large" | "medium"; // large = 820px (Home), medium = 420px (others)
}

export default function Hero({
  title,
  description,
  imageUrl,
  size = "medium",
}: HeroProps) {
  const heroHeight = size === "large" ? "h-[820px]" : "h-[420px]";

  return (
    <section
      className={`relative w-full overflow-hidden ${heroHeight}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
        <h1 className="text-[38px] font-semibold leading-[154%] max-w-[498px] md:max-w-[684px]">
          {title}
        </h1>
        <p className="text-[30px] font-normal leading-[154%] max-w-[456px] md:max-w-[684px]">
          {description}
        </p>
      </div>
    </section>
  );
}
