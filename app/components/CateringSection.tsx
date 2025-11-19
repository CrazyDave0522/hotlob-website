"use client";

import Link from "next/link";
import Image from "next/image";

export default function CateringSection() {
  return (
    <section className="relative w-full" style={{ display: 'block', backgroundColor: '#D43B41' }}>
      {/* image in flow sets section height; content is absolutely overlaid so section height = image height */}
      <Image
        src="/images/home-bg-catering.png"
        alt="Catering background"
        width={1920}
        height={669}
        className="w-full h-auto"
        priority
        style={{ aspectRatio: "1920/669", display: 'block' }}
      />

      <div
        className="catering-top"
        style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
      >
        <style>{`
          /* Responsive top spacing: 32px on small screens, 120px on 1920px screens */
          .catering-top { margin-top: clamp(32px, 2vw + 20px, 120px); }
        `}</style>
        <h1
          className="text-[#FFD632] text-center text-[40px] font-semibold leading-normal"
          style={{ fontWeight: 600 }}
        >
          The ULTIMATE Catering Pack!
        </h1>

        <h2
          className="text-white text-center text-[40px] font-semibold leading-normal"
          style={{ fontWeight: 600, marginTop: 12 }}
        >
          Leave as what you have
        </h2>

        <div style={{ marginTop: 12 }}>
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
          style={{
            display: "flex",
            width: "min(10.417vw, 200px)",
            height: "min(2.498vw, 47.956px)",
            justifyContent: "center",
            alignItems: "center",
            gap: "min(0.521vw, 10px)",
            flexShrink: 0,
            borderRadius: "min(1.563vw, 30px)",
            background: "#FFFFFF",
            color: "#1D1E1F",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "none",
            fontSize: "min(1.042vw, 20px)",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          Order online
        </Link>
      </div>
    </section>
  );
}
