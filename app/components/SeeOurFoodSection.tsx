"use client";

import DishCard from "../see-our-food/components/dish-card";
import { Dish } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SeeOurFoodSectionProps {
  dishes: Dish[];
}

export default function SeeOurFoodSection({ dishes }: SeeOurFoodSectionProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  // 只展示前4个
  const topDishes = dishes.slice(0, 4);

  return (
    <section
      className="relative w-full flex flex-col items-center"
      style={{
        backgroundImage: "url(/images/home-bg-see-our-food.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "min(47.917vw, 920px)", // 920/1920 = 47.917% — increased to fit stacked content
        flexShrink: 0,
        paddingBottom: "min(6.25vw, 120px)", // 120/1920
      }}
    >
      {/* 标题 */}
      <h2
        className="text-[34px] font-semibold text-[#1D1E1F] text-center leading-normal"
        style={{ marginTop: "min(3.125vw, 60px)" }} // 60/1920
      >
        See our food
      </h2>
      {/* 菜品卡片区域 */}
      <div
        className="flex gap-6 w-[72.917%] mx-auto justify-center"
        style={{
          marginTop: "min(2.083vw, 40px)", // 40/1920
          maxWidth: "1400px",
        }}
      >
        {topDishes.map((dish, idx) => (
          <div
            key={dish.id}
            className="flex items-end justify-center"
            style={{ width: "25%", minWidth: "280px", height: "min(31.25vw, 600px)" }}
          >
            <DishCard dish={dish} priority={idx < 4} />
          </div>
        ))}
      </div>
      {/* more 按钮 */}
      {/* more 按钮 - 圆形图标上方，文字在下方，间距 10px */}
      {
        // use hover state to switch icon/backgorund reliably
      }
      <button
        onClick={() => router.push("/see-our-food")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col items-center mt-10 transition-colors duration-200"
        style={{ gap: 10 }}
      >
        <div
          className="rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            width: 32,
            height: 32,
            aspectRatio: "1/1",
            background: hovered ? "rgba(234,65,72,0.10)" : "#F9F9F9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src={hovered ? "/images/icons/arrow-right-active.svg" : "/images/icons/arrow-right.svg"}
            alt="more"
            width={20}
            height={20}
            style={{ transition: "filter 0.2s" }}
          />
        </div>
        <span
          style={{
            color: hovered ? "#EA4148" : "#86909C",
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            transition: "color 150ms",
          }}
        >
          More
        </span>
      </button>
    </section>
  );
}
