"use client";

import { useState } from "react"; // only priority prop logic retained
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
  // Removed JS viewport detection; responsive handled by CSS/media

  return (
    // Responsive card: all dimensions scale proportionally with viewport
    // Design base: 332px card (480px height, 590px on hover) in 1920px layout
    // Mobile: 330px width -> 590px height (non-hover), 700px height (hover)
    // Desktop: 332px width -> 480px height (non-hover), 590px height (hover)
    <div className="dish-card dish-card-height relative w-full bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,65,72,0.20)] overflow-visible group">
      {/* Overall content layout - absolutely positioned at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
        style={{ padding: "0 20px 24px" }}
      >
        {/* Dish image - responsive size */}
        <div className="dish-card-image relative rounded-md overflow-hidden transition-all duration-300 group-hover:translate-y-1.5">
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
        <div className="dish-card-content flex flex-col items-start self-stretch">
          {/* Name */}
          <h3 className="dish-card-title font-semibold text-[#1D1E1F] w-full text-left">
            {name}
          </h3>

          {/* Allergen icons */}
          <div className="dish-card-allergens flex w-full justify-start">
            {allergens.map((allergen) => (
              <div
                key={allergen.id}
                className="dish-card-allergen relative"
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
            className={`dish-card-tier flex justify-center items-center rounded-tl-[10px] rounded-br-[10px] font-normal leading-normal ${
              tier === "premium"
                ? "bg-[rgba(234,65,72,0.10)] text-[#EA4148]"
                : "bg-[rgba(28,67,241,0.10)] text-[#416BEA]"
            }`}
          >
            {tier}
          </div>

          {/* Description */}
          <p className="dish-card-description text-left leading-snug overflow-hidden w-full">
            {description}
          </p>
        </div>

        {/* Order button - independent element, maintains proportional spacing from description above */}
        <div className="dish-card-order-wrapper">
          {" "}
          {/* Mobile: 24px fixed, Desktop: responsive max 24px */}
          <OrderButton stores={stores} fallbackUrl={CONSTANTS.ORDER_URL} />
        </div>
      </div>
    </div>
  );
}
