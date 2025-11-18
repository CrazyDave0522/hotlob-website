"use client";

import { CATERING_LAYOUT } from "../constants";

export default function HeroTexts() {
  return (
    <div 
      className="absolute left-0 right-0 flex flex-col items-center gap-4"
      style={{ top: CATERING_LAYOUT.HERO_TOP }}
    >
      {/* CATERING */}
      <h1
        className="text-[#FFD632] text-center text-[40px] font-semibold leading-normal"
        style={{ fontWeight: 600 }}
      >
        The ULTIMATE Catering Pack!
      </h1>

      {/* The ULTIMATE picnic set! */}
      <h2
        className="text-white text-center text-[40px] font-semibold leading-normal"
        style={{ fontWeight: 600 }}
      >
        Leave as what you have
      </h2>

      {/* MIX 16 ROLL SET PAX 4-6 with bullet lines */}
      <div className="text-white text-left text-[24px] font-normal leading-[52px]">
        <p className="font-semibold">MIX 16 ROLL SET PAX 4-6</p>
        <p>6 x Lobster Roll</p>
        <p>5 x Soft Shell Crab Roll</p>
        <p>5 x Prawn Roll</p>
      </div>
    </div>
  );
}
