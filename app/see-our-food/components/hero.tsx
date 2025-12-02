// app/see-our-food/components/hero.tsx
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
        className="lg:hidden relative w-full overflow-hidden"
        style={{
          height: "clamp(210px, calc(420/750*100vw), 420px)",
          backgroundImage: `url(${mobileImageUrl || imageUrl})`,
          backgroundSize: "cover",
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
            style={{ objectFit: "cover" }}
          />
        )}

        {/* Text area */}
        <div
          className="relative z-10 flex flex-col justify-center h-full"
          style={{ paddingLeft: "calc(30/750*100vw)" }} // Left aligned on mobile with responsive padding
        >
          <div className="flex flex-col gap-5" style={{ maxWidth: "calc(684/750*100vw)" }}>
            <h1
              className={`font-semibold leading-[154%] ${
                showOverlay ? "text-white" : "text-[#242424]"
              }`}
              style={{
                fontSize: "clamp(22px, calc(28/750*100vw), 28px)",
                maxWidth: "calc(500/750*100vw)", // Mobile title width cap matches description
                ...(showOverlay
                  ? { textShadow: "0 2px 4px rgba(0, 0, 0, 0.25)" }
                  : {}),
              }}
            >
              {title}
            </h1>
            <div
              className={`font-normal leading-[154%] space-y-2 ${
                showOverlay ? "text-white" : "text-[#999]"
              }`}
              style={{
                fontSize: "clamp(16px, calc(20/750*100vw), 20px)",
                maxWidth: "calc(500/750*100vw)", // Mobile text width cap to avoid full-width paragraphs
                ...(showOverlay
                  ? { textShadow: "0 2px 4px rgba(0, 0, 0, 0.25)" }
                  : {}),
              }}
            >
              {description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note (optional) */}
        {footerNote && (
          <div
            className="absolute z-10 bottom-2.5 left-0"
            style={{ paddingLeft: "calc(30/750*100vw)" }} // Mobile left padding
          >
            <p className="text-[#C9CDD4] text-[12px] font-normal leading-none text-left">
              {footerNote}
            </p>
          </div>
        )}
      </section>

      {/* Desktop Hero — visible at 1024px and above */}
      <section
        className="hidden lg:block relative w-full overflow-hidden"
        style={{
          height: heroHeight,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
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
            style={{ objectFit: "cover" }}
          />
        )}

        {/* Text area */}
        <div
          className={`relative z-10 flex flex-col justify-center h-full gap-5 ${
            showOverlay ? "text-white" : ""
          }`}
          style={{ paddingLeft: "min(13.542vw, 260px)" }} // 260/1920 = 13.542%
        >
          <h1
            className={`font-semibold ${
              showOverlay ? "leading-[154%]" : "leading-normal text-[#242424]"
            }`}
            style={{
              maxWidth: "min(35.625vw, 684px)", // 684/1920 = 35.625%
              fontSize: "clamp(24px, 2vw, 38px)", // Unified title font size
              ...(showOverlay
                ? { textShadow: "0 2px 4px rgba(0, 0, 0, 0.25)" }
                : {}),
            }}
          >
            {title}
          </h1>
          <div
            className={`font-normal space-y-2 ${
              showOverlay ? "leading-[154%]" : "leading-normal text-[#999]"
            }`}
            style={{
              maxWidth: "min(35.625vw, 684px)", // 684/1920 = 35.625%
              fontSize: "clamp(18px, 1.563vw, 30px)", // Unified body font size
              ...(showOverlay
                ? { textShadow: "0 2px 4px rgba(0, 0, 0, 0.25)" }
                : {}),
            }}
          >
            {description.split("\n").map((paragraph, index) => (
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
    </>
  );
}
