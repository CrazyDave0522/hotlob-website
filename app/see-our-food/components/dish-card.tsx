"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dish } from "@/types/types";
import { CONSTANTS } from "@/lib/constants";
import OrderButton from "./order-button";

interface DishCardProps {
  dish: Dish;
  priority?: boolean;
}

export default function DishCard({ dish, priority = false }: DishCardProps) {
  const { name, description, tier, imageUrl, allergens, stores } = dish;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile dimensions: 330px width, scaled height from desktop ratio (332px -> 480px/590px)
  // Desktop: 332px width -> 480px height (non-hover), 590px height (hover)
  // Mobile: 330px width -> 590px height (non-hover), 700px height (hover)
  const cardHeight = isMobile ? "590px" : "min(25vw, 480px)";
  const cardHeightHover = isMobile ? "700px" : "min(30.729vw, 590px)";
  const maxWidth = isMobile ? "330px" : "332px";

  return (
    // Responsive card: all dimensions scale proportionally with viewport
    // Design base: 332px card (480px height, 590px on hover) in 1920px layout
    <div
      className="relative w-full bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,65,72,0.20)] overflow-visible group"
      style={{
        height: cardHeight,
        maxWidth: maxWidth,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.height = cardHeightHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.height = cardHeight;
      }}
    >
      {/* Overall content layout - absolutely positioned at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
        style={{ padding: isMobile ? "0 20px 24px" : "0 min(1.042vw, 20px) min(1.25vw, 24px)" }} // Mobile: fixed 20px horizontal padding, Desktop: responsive
      >
        {/* Dish image - responsive size */}
        <div
          className="relative rounded-md overflow-hidden transition-all duration-300 group-hover:translate-y-1.5"
          style={{
            width: isMobile ? "calc((230 / 750) * 100vw)" : "min(11.979vw, 230px)", // Mobile: scales with 750 baseline, Desktop: responsive
            height: isMobile ? "calc((230 / 750) * 100vw)" : "min(11.979vw, 230px)",
            maxWidth: isMobile ? "230px" : undefined,
            maxHeight: isMobile ? "230px" : undefined,
            marginBottom: isMobile ? "20px" : "min(1.042vw, 20px)", // mb-5
          }}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width:750px) calc((230 / 750) * 100vw), 230px"
          />
        </div>

        {/* Content container - name, tag, tier, description, left-aligned, proportional spacing */}
        <div
          className="flex flex-col items-start self-stretch"
          style={{ gap: isMobile ? "20px" : "min(0.729vw, 14px)" }} // Mobile: 20px fixed for better spacing, Desktop: responsive
        >
          {/* Name */}
          <h3
            className="font-semibold text-[#1D1E1F] w-full text-left"
            style={{
              fontSize: isMobile ? "28px" : "20px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            {name}
          </h3>

          {/* Allergen icons */}
          <div
            className="flex w-full justify-start"
            style={{ gap: isMobile ? "24px" : "min(0.729vw, 14px)" }} // Mobile: 24px fixed, Desktop: responsive
          >
            {allergens.map((allergen) => (
              <div
                key={allergen.id}
                className="relative"
                style={{
                  width: isMobile ? "50px" : "min(2.083vw, 40px)", // Mobile: 50px fixed, Desktop: responsive
                  height: isMobile ? "50px" : "min(2.083vw, 40px)",
                }}
              >
                <Image
                  src={allergen.icon_url || CONSTANTS.DEFAULT_TAG_ICON}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* tier */}
          <div
            className={`flex justify-center items-center rounded-tl-[10px] rounded-br-[10px] font-normal leading-normal ${
              tier === "premium"
                ? "bg-[rgba(234,65,72,0.10)] text-[#EA4148]"
                : "bg-[rgba(28,67,241,0.10)] text-[#416BEA]"
            }`}
            style={{
              width: isMobile ? "130px" : "min(5.208vw, 100px)", // Mobile: 130px fixed, Desktop: responsive
              height: isMobile ? "34px" : "min(1.354vw, 26px)", // Mobile: fixed 34px height, Desktop: responsive
              gap: isMobile ? "10px" : "10px", // 10px gap for both
              padding: isMobile ? "0" : "0", // Mobile: no padding, Desktop: none
              fontSize: isMobile ? "24px" : "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {tier}
          </div>

          {/* Description */}
          <p
            className="text-left leading-snug overflow-hidden w-full"
            style={{
              height: isMobile ? "180px" : "min(6.51vw, 125px)", // Mobile: fixed 136px height, Desktop: responsive
              fontSize: isMobile ? "24px" : "clamp(14px, 0.938vw, 18px)", // Mobile: 24px fixed, Desktop: responsive
              color: "#86909C",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {description}
          </p>
        </div>

        {/* Order button - independent element, maintains proportional spacing from description above */}
        <div style={{ marginTop: isMobile ? "24px" : "min(1.25vw, 24px)" }}>
          {" "}
          {/* Mobile: 24px fixed, Desktop: responsive max 24px */}
          <OrderButton stores={stores} fallbackUrl={CONSTANTS.ORDER_URL} />
        </div>
      </div>
    </div>
  );
}
