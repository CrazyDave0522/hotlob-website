"use client";

import Image from "next/image";
import { Dish } from "@/types/types";
import { CONSTANTS } from "@/lib/constants";
import OrderButton from "./order-button";

interface DishCardProps {
  dish: Dish;
  priority?: boolean;
}

export default function DishCard({ dish, priority = false }: DishCardProps) {
  const { name, description, tier, imageUrl, tags, stores } = dish;
  return (
    // Responsive card: all dimensions scale proportionally with viewport
    // Design base: 332px card (480px height, 590px on hover) in 1920px layout
    <div 
      className="relative w-full bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,65,72,0.20)] overflow-visible group"
      style={{ 
        height: 'min(25vw, 480px)', // 480/1920 = 25%
        maxWidth: '332px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.height = 'min(30.729vw, 590px)'; // 590/1920 = 30.729%
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.height = 'min(25vw, 480px)'; // 480/1920 = 25%
      }}
    >
      {/* Overall content layout - absolutely positioned at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
        style={{ padding: '0 min(1.042vw, 20px) min(1.25vw, 24px)' }} // px-5 pb-6
      >
        {/* Dish image - responsive size */}
        <div 
          className="relative rounded-md overflow-hidden transition-all duration-300 group-hover:translate-y-1.5"
          style={{ 
            width: 'min(11.979vw, 230px)', // 230/1920 = 11.979%
            height: 'min(11.979vw, 230px)',
            marginBottom: 'min(1.042vw, 20px)' // mb-5
          }}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 1920px) 11.979vw, 230px"
          />
        </div>

        {/* Content container - name, tag, tier, description, left-aligned, proportional spacing */}
        <div 
          className="flex flex-col items-start self-stretch"
          style={{ gap: 'min(0.729vw, 14px)' }} // gap-3.5 = 14px
        >
          {/* Name */}
          <h3 
            className="font-semibold text-[#1D1E1F] w-full text-left text-[20px]"
          >
            {name}
          </h3>

          {/* Tag icons */}
          <div 
            className="flex w-full justify-start"
            style={{ gap: 'min(0.729vw, 14px)' }} // gap-3.5 = 14px
          >
            {tags.map((tag) => (
              <div 
                key={tag.id}
                className="relative"
                style={{ 
                  width: 'min(2.083vw, 40px)', // 40/1920 = 2.083%
                  height: 'min(2.083vw, 40px)'
                }}
              >
                <Image
                  src={tag.icon_url || CONSTANTS.DEFAULT_TAG_ICON}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* tier */}
          <div
            className={`flex justify-center items-center gap-2.5 rounded-tl-[10px] rounded-br-[10px] text-[16px] font-normal leading-normal ${
              tier === "premium"
                ? "bg-[rgba(234,65,72,0.10)] text-[#EA4148]"
                : "bg-[rgba(28,67,241,0.10)] text-[#416BEA]"
            }`}
            style={{ 
              width: 'min(5.208vw, 100px)', // 100/1920 = 5.208%
              height: 'min(1.354vw, 26px)' // 26/1920 = 1.354%
            }}
          >
            {tier}
          </div>

          {/* Description */}
          <p 
            className="text-[#86909C] text-left leading-snug overflow-hidden w-full text-[18px]"
            style={{ 
              height: 'min(6.51vw, 125px)' // 125/1920 = 6.51%
            }}
          >
            {description}
          </p>
        </div>

        {/* Order button - independent element, maintains proportional spacing from description above */}
        <div style={{ marginTop: 'min(0.729vw, 14px)' }}> {/* mt-3.5 = 14px */}
          <OrderButton stores={stores} fallbackUrl={CONSTANTS.ORDER_URL} />
        </div>
      </div>
    </div>
  );
}
