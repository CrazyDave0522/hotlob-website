"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SectionTitle } from "./SectionTitle";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full">
      {/* Background image - conditionally rendered */}
      {isMobile ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/images/home-bg-about-hotlob-mb.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
          }}
        />
      ) : (
        <Image
          src="/images/home-bg-about-hotlob.png"
          alt="About Hotlob background"
          width={1920}
          height={640}
          className="w-full h-auto"
          priority
          style={{ aspectRatio: "1920/640", display: "block" }}
        />
      )}

      {/* Desktop content - absolute positioned */}
      <div
        className="hidden lg:block"
        style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
      >
        {/* Title */}
        <SectionTitle>About Hotlob</SectionTitle>

        {/* Desktop: Three-column card container */}
        <div
          className="hidden lg:flex gap-5 shrink-0 w-[72.917%] mx-auto justify-center" // 1400/1920 = 72.917%
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

      {/* Mobile content - natural flow to expand section height */}
      <div className="lg:hidden relative z-10 px-4 pb-8 pt-4">
        {/* Title */}
        <div className="mb-8 -mt-6">
          <SectionTitle>About Hotlob</SectionTitle>
        </div>

        {/* Mobile: Two-row card layout */}
        <div
          className="flex flex-col items-center justify-end"
          style={{
            gap: "20px", // 两行卡片的上下间距
          }}
        >
          {/* First row: Active card takes full width */}
          <div 
            className="w-full flex justify-center"
            style={{
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {cards
              .filter((card) => expandedCard === card.id)
              .map((card) => (
                <div
                  key={card.id}
                  className="relative cursor-pointer overflow-hidden rounded-[20px]"
                  style={{
                    width: "690px",
                    height: "300px",
                    flexShrink: 0,
                    maxWidth: "100%",
                    margin: "0 30px", // 左右边距30px
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: "scale(1)",
                    transformOrigin: "center",
                  }}
                  onClick={() => setExpandedCard(card.id)}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${
                        isMobile
                          ? card.bgExpanded.replace(".png", "-mb.png")
                          : card.bgExpanded
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Card content */}
                  <div
                    className="absolute inset-0 flex flex-col"
                    style={{
                      paddingTop: "40px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingBottom: "40px",
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      opacity: 1,
                      transform: "translateY(0px)",
                    }}
                  >
                    <h3
                      style={{
                        color: "#FFF",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                        marginBottom: "20px",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        color: "#FFF",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px", // 150%
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 8,
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Second row: Two inactive cards side by side */}
          <div
            className="flex justify-center"
            style={{
              gap: "30px", // 左右间距30px
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {cards
              .filter((card) => expandedCard !== card.id)
              .map((card) => (
                <div
                  key={card.id}
                  className="relative cursor-pointer overflow-hidden rounded-[20px]"
                  style={{
                    width: "330px",
                    height: "300px",
                    flexShrink: 0,
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: "scale(1)",
                    transformOrigin: "center",
                  }}
                  onClick={() => setExpandedCard(card.id)}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${
                        isMobile
                          ? card.bgCollapsed.replace(".png", "-mb.png")
                          : card.bgCollapsed
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Card content */}
                  <div
                    className="absolute inset-0 flex flex-col"
                    style={{
                      paddingTop: "40px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingBottom: "40px",
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      opacity: 1,
                      transform: "translateY(0px)",
                    }}
                  >
                    <h3
                      style={{
                        color: "#333",
                        fontSize: "24px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                        marginBottom: "20px",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        color: "#4E5969",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px", // 150%
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "pre-line"
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
