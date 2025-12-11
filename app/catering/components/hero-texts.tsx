"use client";

import { CATERING_LAYOUT } from "../constants";

export default function HeroTexts() {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3 pt-[clamp(32px,calc(108/750*100vw),108px)] md:absolute md:left-0 md:right-0 md:pt-0" style={{ top: CATERING_LAYOUT.HERO_TOP }}>
      {/* CATERING */}
      <h1 className="catering-hero-title text-[#FFD632] text-center font-semibold leading-normal">
        The ULTIMATE Catering Pack!
      </h1>

      {/* The ULTIMATE picnic set! */}
      <h2 className="catering-hero-subtitle text-white text-center font-semibold leading-normal">
        Leave as what you have
      </h2>

      {/* MIX 16 ROLL SET PAX 4-6 with bullet lines */}
      <div className="catering-hero-desc text-white text-left font-normal">
        <p className="font-semibold">MIX 16 ROLL SET PAX 4-6</p>
        <p>6 x Lobster Roll</p>
        <p>5 x Soft Shell Crab Roll</p>
        <p>5 x Prawn Roll</p>
      </div>
    </div>
  );
}
