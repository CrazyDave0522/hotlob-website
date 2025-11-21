"use client";

import { useState } from "react";
import Image from "next/image";

const cards = [
  {
    id: 1,
    title: "A quick bite that feels like a treat",
    description:
      "Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche —  the perfect grab-and-go roll that fits any craving or budget.",
    bgCollapsed: "/images/three-column-cards/card1.png",
    bgExpanded: "/images/three-column-cards/card1-active.png",
  },
  {
    id: 2,
    title: "Our Story",
    description:
      "Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.",
    bgCollapsed: "/images/three-column-cards/card2.png",
    bgExpanded: "/images/three-column-cards/card2-active.png",
  },
  {
    id: 3,
    title: "🦞 The Hotlob Hits",
    description: `✨ Truffle & Cheese Lobster Roll
Our signature. Rich truffle sauce, Aussie lobster, and torched parmesan for perfection.
✨ Lemon & Dill Lobster Roll
Light but creamy and addictive — fresh Australian lobster tossed with dill mayo and lemon dressing.
✨ Soft Shell Crab Roll
Crispy soft-shell crab with Thai green sauce, topped with fresh chilli slices for the perfect balance of crunch and heat.`,
    bgCollapsed: "/images/three-column-cards/card3.png",
    bgExpanded: "/images/three-column-cards/card3-active.png",
  },
];

export default function AboutHotlob() {
  const [expandedCard, setExpandedCard] = useState<number>(1); // Default: card 1 expanded

  return (
    <section className="relative w-full" style={{ display: 'block' }}>
      {/* Background image sets section height; content overlays absolutely */}
      <Image
        src="/images/home-bg-about-hotlob.png"
        alt="About Hotlob background"
        width={1920}
        height={640}
        className="w-full h-auto"
        priority
        style={{ aspectRatio: '1920/640', display: 'block' }}
      />

      <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
        {/* Title */}
        <h2
          className="font-semibold text-[#1D1E1F] text-center leading-normal"
          style={{ 
            marginTop: "min(3.125vw, 60px)", // 60/1920
            fontSize: 'clamp(24px, 1.771vw, 34px)'
          }}
        >
          About Hotlob
        </h2>

      {/* Three-column card container */}
      <div
        className="flex gap-5 shrink-0 w-[72.917%] mx-auto justify-center" // 1400/1920 = 72.917%
        style={{
          height: "min(21.927vw, 421px)", // 421/1920 = 21.927%
          marginTop: "min(2.083vw, 40px)", // 40/1920 = 2.083%
        }}
      >
        {cards.map((card) => {
          const isExpanded = expandedCard === card.id;
          return (
            <div
              key={card.id}
              className="shrink-0 relative cursor-pointer overflow-hidden rounded-[20px]"
              style={{
                width: isExpanded ? "40%" : "28.571%", // 560/1400=40%, 400/1400=28.571%
                height: "100%", // Fill parent container height
                transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => setExpandedCard(card.id)}
              onClick={() => setExpandedCard(card.id)}
            >
              {/* Background images with crossfade effect */}
              <div
                className="absolute inset-0 transition-opacity duration-400"
                style={{
                  backgroundImage: `url(${card.bgCollapsed})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: isExpanded ? 0 : 1,
                }}
              />
              <div
                className="absolute inset-0 transition-opacity duration-400"
                style={{
                  backgroundImage: `url(${card.bgExpanded})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: isExpanded ? 1 : 0,
                }}
              />

              {/* Card content */}
              <div
                className="absolute inset-0 flex flex-col px-[30px]"
                style={{ paddingTop: "min(3.125vw, 60px)" }} // 60/1920 = 3.125%
              >
                <h3
                  className="text-[26px] font-semibold leading-normal transition-colors duration-400"
                  style={{
                    color: isExpanded ? "#FFF" : "#333",
                    marginBottom: "min(1.042vw, 20px)", // 20/1920 = 1.042%
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-base font-normal overflow-hidden text-white whitespace-pre-line"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 9,
                    WebkitBoxOrient: "vertical",
                    // 段间距由行高决定：使用响应式行高，1920 下为 24px，小屏更小
                    lineHeight: "clamp(20px, 1.25vw, 24px)",
                    opacity: isExpanded ? 1 : 0,
                    transition: isExpanded
                      ? "opacity 300ms ease-in 280ms"
                      : "opacity 200ms ease-out",
                    pointerEvents: isExpanded ? "auto" : "none",
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
