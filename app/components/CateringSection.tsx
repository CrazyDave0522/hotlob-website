"use client";

import Link from "next/link";
import Image from "next/image";

export default function CateringSection() {

  return (
    <section className="catering-section relative w-full">
      <Image
        src="/images/home-bg-catering-mb.png"
        alt="Catering background"
        width={750}
        height={580}
        className="catering-bg-mobile w-full h-auto"
        priority
        sizes="(max-width:750px) 100vw, 750px"
      />
      <Image
        src="/images/home-bg-catering.png"
        alt="Catering background"
        width={1920}
        height={669}
        className="catering-bg-desktop w-full h-auto"
        priority
        sizes="(max-width:1023px) 0vw, 100vw"
      />

      <div
        className="catering-top"
        style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
      >
        <style>{`
          /* Mobile: clamp margin-top, Desktop: responsive spacing */
          @media (max-width: 1023px) {
            .catering-top { margin-top: clamp(32px, calc(108 / 750 * 100vw), 108px); }
            .catering-subtitle { margin-top: clamp(8px, calc(16 / 750 * 100vw), 16px); }
            .catering-content { margin-top: clamp(8px, calc(16 / 750 * 100vw), 16px); }
          }
          @media (min-width: 1024px) {
            .catering-top { margin-top: clamp(32px, 2vw + 20px, 120px); }
            .catering-subtitle { margin-top: 12px; }
            .catering-content { margin-top: 12px; }
          }
        `}</style>
        <h1
          className="catering-section-title text-[#FFD632] text-center font-semibold leading-normal"
          style={{ fontWeight: 600 }}
        >
          The ULTIMATE Catering Pack!
        </h1>

        <h2
          className="catering-section-title text-white text-center font-semibold leading-normal catering-subtitle"
          style={{ fontWeight: 600 }}
        >
          Leave as what you have
        </h2>

        <div className="catering-content">
          <div
            className="text-white text-center font-normal"
            style={{
              width: "72.917%",
              maxWidth: 1400,
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "clamp(14px, calc(24 / 750 * 100vw), 24px)",
              lineHeight: "clamp(26px, calc(52 / 750 * 100vw), 52px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <p className="font-semibold">MIX 16 ROLL SET PAX 4-6</p>
              <p>6 x Lobster Roll</p>
              <p>5 x Soft Shell Crab Roll</p>
              <p>5 x Prawn Roll</p>
            </div>
          </div>
        </div>
      </div>

      <div className="catering-button-wrapper">
        <Link
          href="/catering#catering-form"
          className="catering-order-btn transition-all duration-200 text-[#1D1E1F] hover:text-[#EA4148] hover:bg-gray-50 active:text-[#EA4148] active:bg-gray-100 active:scale-95 focus:text-[#EA4148] focus:bg-gray-100 focus:scale-95 md:focus:scale-100 md:focus:bg-transparent md:focus:text-[#1D1E1F]"
        >
          Order Online
        </Link>
      </div>
    </section>
  );
}
