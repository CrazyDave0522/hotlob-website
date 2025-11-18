"use client";

import { CATERING_LAYOUT } from "../constants";

export default function FormTitle() {
  return (
    <div 
      className="absolute left-0 right-0 flex flex-col items-center gap-2.5"
      style={{ top: CATERING_LAYOUT.FORM_TITLE_TOP }}
    >
      <h2 className="text-[#1D1E1F] text-center text-[28px] font-semibold leading-normal">
        ORDER NOW
      </h2>
      <p className="text-[#86909C] text-center text-[14px] font-normal leading-normal">
        Please note that orders need to be placed 48 hours (business days)
        ahead of pick up day.
      </p>
    </div>
  );
}
