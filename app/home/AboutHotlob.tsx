"use client";

import { useState } from "react";
import { SectionTitle } from "../components/SectionTitle";

const cards = [
  {
    id: 1,
    title: "Our Story",
    description:
      "Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.",
    bgCollapsed: "/images/three-column-cards/card2.png",
    bgExpanded: "/images/three-column-cards/card2-active.png",
  },
  {
    id: 2,
    title: "A quick bite that feels like a treat",
    description:
      "Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche —  the perfect grab-and-go roll that fits any craving or budget.",
    bgCollapsed: "/images/three-column-cards/card1.png",
    bgExpanded: "/images/three-column-cards/card1-active.png",
  },
  {
    id: 3,
    title: "🦞 The Hotlob Hits",
    description: `✨ Truffle & Cheese Lobster Roll
✨ Lemon & Dill Lobster Roll
✨ Soft Shell Crab Roll`,
    bgCollapsed: "/images/three-column-cards/card3.png",
    bgExpanded: "/images/three-column-cards/card3-active.png",
  },
];

export default function AboutHotlob() {
  const [expandedCard, setExpandedCard] = useState<number>(1); // Default: card 1 expanded

  return (
    <section className="about-hotlob-section relative w-full">
      {/* Background images: render both with responsive visibility */}
      {/* Unified responsive background handled via CSS media queries */}
      <div className="about-hotlob-bg absolute inset-0" aria-hidden="true" />

      {/* Desktop content - absolute positioned */}
      <div className="hidden lg:block about-desktop-full">
        {/* Title */}
        <SectionTitle>About Hotlob</SectionTitle>

        {/* Desktop: Three-column card container */}
        <div className="hidden lg:flex gap-5 shrink-0 w-[72.917%] mx-auto justify-center about-cards-desktop-dim">
          {cards.map((card) => {
            const isExpanded = expandedCard === card.id;
            return (
              <div
                key={card.id}
                className="button-click shrink-0 relative cursor-pointer overflow-hidden rounded-[20px] about-card-desktop"
                style={{
                  width: isExpanded ? "40%" : "28.571%", // 560/1400=40%, 400/1400=28.571%
                }}
                onMouseEnter={() => setExpandedCard(card.id)}
                onClick={() => setExpandedCard(card.id)}
              >
                {/* Background images with crossfade effect */}
                <div
                  className="absolute inset-0 transition-opacity duration-400 bg-cover-center"
                  style={{
                    backgroundImage: `url(${card.bgCollapsed})`,
                    opacity: isExpanded ? 0 : 1,
                  }}
                />
                <div
                  className="absolute inset-0 transition-opacity duration-400 bg-cover-center"
                  style={{
                    backgroundImage: `url(${card.bgExpanded})`,
                    opacity: isExpanded ? 1 : 0,
                  }}
                />

                {/* Card content */}
                <div className="absolute inset-0 flex flex-col px-[30px] about-card-content-padding-desktop">
                  <h3
                    className={`about-hotlob-tab-text font-semibold leading-normal transition-colors duration-400 about-card-title-margin ${isExpanded ? 'about-hotlob-tab-text--active' : ''}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`font-normal text-white whitespace-pre-line about-desc-clamp-desktop about-hotlob-card-desc about-card-desc ${isExpanded ? 'about-card-desc--active' : ''}`}
                    aria-hidden={!isExpanded}
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
        <SectionTitle>About Hotlob</SectionTitle>

        {/* Mobile: Two-row card layout */}
        <div className="flex flex-col items-center justify-end about-mobile-rows-gap">
          {/* First row: Active card takes full width */}
          <div className="w-full flex justify-center">
            {cards
              .filter((card) => expandedCard === card.id)
              .map((card) => {
                return (
                  <div
                    key={card.id}
                    className="button-click relative cursor-pointer overflow-hidden rounded-[20px] about-mobile-active-card"
                    onClick={() => setExpandedCard(card.id)}
                  >
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover-center"
                      style={{
                        backgroundImage: `url(${card.bgExpanded.replace(
                          ".png",
                          "-mb.png"
                        )})`,
                      }}
                    />

                    {/* Card content */}
                    <div className="absolute inset-0 flex flex-col about-mobile-card-content-padding">
                      <h3
                        className="about-hotlob-card-title about-mobile-title-margin font-semibold about-hotlob-card-title--white"
                      >
                        {card.title}
                      </h3>
                          <p className="about-mobile-desc-typography about-desc-clamp-mobile about-mobile-desc-anim">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Second row: Two inactive cards side by side */}
          <div className="flex justify-center about-mobile-inactive-gap">
            {cards
              .filter((card) => expandedCard !== card.id)
              .map((card) => (
                <div
                  key={card.id}
                  className="button-click relative cursor-pointer overflow-hidden rounded-[20px] about-mobile-inactive-card"
                  onClick={() => setExpandedCard(card.id)}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover-center"
                    style={{
                      backgroundImage: `url(${card.bgCollapsed.replace(
                        ".png",
                        "-mb.png"
                      )})`,
                    }}
                  />

                  {/* Card content */}
                  <div className="absolute inset-0 flex flex-col about-mobile-card-content-padding">
                    <h3 className="about-hotlob-card-title about-mobile-title-margin about-mobile-title-anim">
                      {card.title}
                    </h3>
                    {/* description removed for inactive mobile cards to match desktop behavior */}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
