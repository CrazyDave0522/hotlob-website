"use client";

import DishCard from "../see-our-food/components/dish-card";
import { Dish } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SectionTitle } from "./SectionTitle";

interface SeeOurFoodSectionProps {
  dishes: Dish[];
}

export default function SeeOurFoodSection({ dishes }: SeeOurFoodSectionProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Display only the first 4 dishes
  const topDishes = dishes.slice(0, 4);

  return (
    <section className="relative w-full" style={{ display: 'block', backgroundColor: '#FDF7F0' }}>
      {/* Background image - conditionally rendered */}
      {isMobile ? (
        <Image
          src="/images/home-bg-see-our-food-mb.png"
          alt="See our food background"
          width={750}
          height={1750}
          className="w-full h-auto"
          priority
          style={{ aspectRatio: "750/1750", display: 'block' }}
        />
      ) : (
        <Image
          src="/images/home-bg-see-our-food.png"
          alt="See our food background"
          width={1920}
          height={920}
          className="w-full h-auto"
          priority
          style={{ aspectRatio: '1920/920', display: 'block' }}
        />
      )}

      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Title */}
        <SectionTitle>See our food</SectionTitle>
      {/* Dish cards section */}
      <div
        className={isMobile ? "flex flex-wrap w-full justify-center" : "flex gap-6 w-[72.917%] mx-auto justify-center"}
        style={{
          marginTop: isMobile ? "0px" : "min(1.042vw, 20px)", // Mobile: 0px, Desktop: responsive max 20px
          maxWidth: isMobile ? "none" : "1400px",
          gap: isMobile ? "30px" : undefined,
          paddingLeft: isMobile ? "30px" : undefined,
          paddingRight: isMobile ? "30px" : undefined
        }}
      >
        {topDishes.map((dish, idx) => (
          <div
            key={dish.id}
            className="flex items-end justify-center"
            style={{
              width: isMobile ? "calc(50% - 15px)" : "25%",
              minWidth: isMobile ? "160px" : "280px",
              height: isMobile ? "700px" : "min(31.25vw, 600px)", // Increased mobile height to accommodate DishCard default state (590px)
              marginBottom: isMobile ? "16px" : "0"
            }}
          >
            <DishCard dish={dish} priority={idx < 4} />
          </div>
        ))}
      </div>
      {/* More button - icon on top, text below, 10px gap */}
      {
        // use hover state to switch icon/background reliably
      }
      <button
        onClick={() => router.push("/see-our-food")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="button-click flex flex-col items-center mt-8 transition-all duration-200"
        style={{ gap: 10 }}
      >
        <div
          className="rounded-full flex items-center justify-center transition-colors duration-200 bg-[#FDE4D5]"
          style={{
            width: isMobile ? 50 : 32,
            height: isMobile ? 50 : 32,
            aspectRatio: "1/1",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src={hovered ? "/images/icons/arrow-right-active.svg" : "/images/icons/arrow-right.svg"}
            alt="more"
            width={isMobile ? 36 : 20}
            height={isMobile ? 36 : 20}
            style={{ transition: "filter 0.2s" }}
          />
        </div>
        <span
          className={`transition-colors duration-200 ${
            hovered ? "text-[#EA4148]" : "text-[#86909C]"
          } active:text-[#D32F2F]`}
          style={{
            fontSize: isMobile ? 26 : 16,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          More
        </span>
      </button>
      </div>
    </section>
  );
}
