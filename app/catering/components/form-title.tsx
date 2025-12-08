"use client";

import { CATERING_LAYOUT } from "../constants";

export default function FormTitle() {
  return (
    <div className="form-title-container">
      <h2 
        className="catering-form-title text-[#1D1E1F] text-center font-semibold leading-normal" 
        style={{ 
          fontSize: "clamp(20px, calc(40/750*100vw), 40px)",
        }}
      >
        ORDER NOW
      </h2>
      <p 
        className="catering-form-desc text-[#86909C] text-center font-normal leading-normal max-w-[clamp(280px,calc(578/750*100vw),578px)] md:max-w-none" 
        style={{ 
          fontSize: "clamp(12px, calc(24/750*100vw), 24px)"
        }}
      >
        Please note that orders need to be placed 48 hours (business days)
        ahead of pick up day.
      </p>
      <style jsx>{`
        @media (min-width: 1024px) {
          h2.catering-form-title {
            font-size: clamp(14px, calc(28/1920*100vw), 28px) !important;
          }
          p.catering-form-desc {
            font-size: clamp(7px, calc(14/1920*100vw), 14px) !important;
          }
        }
      `}</style>
    </div>
  );
}
