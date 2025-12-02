"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CateringSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative w-full" style={{ display: 'block', backgroundColor: '#D43B41' }}>
      {/* Background image - conditionally rendered */}
      {isMobile ? (
        <Image
          src="/images/home-bg-catering-mb.png"
          alt="Catering background"
          width={750}
          height={580}
          className="w-full h-auto"
          priority
          sizes="(max-width:750px) 100vw, 750px"
          style={{ aspectRatio: "750/580", display: 'block' }}
        />
      ) : (
        <Image
          src="/images/home-bg-catering.png"
          alt="Catering background"
          width={1920}
          height={669}
          className="w-full h-auto"
          priority
          sizes="(max-width:750px) 100vw, 100vw"
          style={{ aspectRatio: "1920/669", display: 'block' }}
        />
      )}

      <div
        className="catering-top"
        style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
      >
        <style>{`
          /* Mobile: 108px from top, Desktop: responsive spacing */
          @media (max-width: 1023px) {
            .catering-top { margin-top: 108px; }
            .catering-subtitle { margin-top: 16px; }
            .catering-content { margin-top: 16px; }
          }
          @media (min-width: 1024px) {
            .catering-top { margin-top: clamp(32px, 2vw + 20px, 120px); }
            .catering-subtitle { margin-top: 12px; }
            .catering-content { margin-top: 12px; }
          }
        `}</style>
        <h1
          className="text-[#FFD632] text-center text-[40px] font-semibold leading-normal"
          style={{ fontWeight: 600 }}
        >
          The ULTIMATE Catering Pack!
        </h1>

        <h2
          className="text-white text-center text-[40px] font-semibold leading-normal catering-subtitle"
          style={{ fontWeight: 600 }}
        >
          Leave as what you have
        </h2>

        <div className="catering-content">
          <div
            className="text-white text-center text-[24px] font-normal leading-[52px]"
            style={{
              width: "72.917%",
              maxWidth: 1400,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <p className="font-semibold">MIX 16 ROLL SET PAX 4-6</p>
            <p>6 x Lobster Roll</p>
            <p>5 x Soft Shell Crab Roll</p>
            <p>5 x Prawn Roll</p>
          </div>
        </div>
      </div>

      {/* Button positioned independently at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(15px, 3.9vw - 5px, 70px)",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          href="/catering#catering-form"
          className={`transition-all duration-200 text-[#1D1E1F] hover:text-[#EA4148] hover:bg-gray-50 active:text-[#EA4148] active:bg-gray-100 active:scale-95 ${isMobile ? 'focus:text-[#EA4148] focus:bg-gray-100 focus:scale-95' : ''}`}
          style={{
            display: "flex",
            width: isMobile ? "240px" : "min(10.417vw, 200px)",
            height: isMobile ? "56px" : "min(2.498vw, 47.956px)",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? "10px" : "min(0.521vw, 10px)",
            flexShrink: 0,
            borderRadius: isMobile ? "30px" : "min(1.563vw, 30px)",
            background: "#FFFFFF",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "none",
            fontSize: isMobile ? "24px" : "min(1.042vw, 20px)",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            WebkitTapHighlightColor: isMobile ? "rgba(234, 65, 72, 0.1)" : "transparent",
            outline: "none",
          }}
        >
          Order Online
        </Link>
      </div>
    </section>
  );
}
