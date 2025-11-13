"use client";

import Image from "next/image";
import { Dish } from "@/types/types";
import { CONSTANTS } from "@/lib/constants";
import OrderButton from "./order-button";

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { name, description, tier, imageUrl, tags, stores } = dish;
  return (
    <div className="relative w-[332px] h-[480px] bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:h-[590px] hover:shadow-[0_0_20px_rgba(234,65,72,0.20)] overflow-visible group">
      {/* Overall content layout - absolutely positioned at bottom, fixed */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-5 pb-6">
        {/* Dish image - independent element, 20px gap with name when not hovered, moves down 6px to 14px gap on hover */}
        <Image
          src={imageUrl}
          alt={name}
          width={230}
          height={230}
          className="rounded-md object-cover mb-5 transition-all duration-300 group-hover:translate-y-1.5 group-hover:mb-3.5"
        />

        {/* Content container - name, tag, tier, description, left-aligned, 14px spacing */}
        <div className="flex flex-col items-start gap-3.5 self-stretch">
          {/* Name */}
          <h3 className="text-[20px] font-semibold text-[#1D1E1F] w-full text-left">
            {name}
          </h3>

          {/* Tag icons */}
          <div className="flex gap-3.5 w-full justify-start">
            {tags.map((tag) => (
              <Image
                key={tag.id}
                src={tag.icon_url || CONSTANTS.DEFAULT_TAG_ICON}
                alt=""
                width={40}
                height={40}
                className="object-contain"
              />
            ))}
          </div>

          {/* tier */}
          <div
            className={`flex w-[100px] h-[26px] justify-center items-center gap-2.5 rounded-tl-[10px] rounded-br-[10px] text-[16px] font-normal leading-normal ${
              tier === "premium"
                ? "bg-[rgba(234,65,72,0.10)] text-[#EA4148]"
                : "bg-[rgba(28,67,241,0.10)] text-[#416BEA]"
            }`}
          >
            {tier}
          </div>

          {/* Description */}
          <p className="h-[125px] text-[#86909C] text-[18px] text-left leading-snug overflow-hidden w-full">
            {description}
          </p>
        </div>

        {/* Order button - independent element, maintains 14px spacing from description above */}
        <div className="mt-3.5">
          <OrderButton stores={stores} fallbackUrl={CONSTANTS.ORDER_URL} />
        </div>
      </div>
    </div>
  );
}
