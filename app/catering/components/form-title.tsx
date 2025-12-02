"use client";

import { CATERING_LAYOUT } from "../constants";

export default function FormTitle() {
  return (
    <div className="form-title-container">
      <h2 className="text-[#1D1E1F] text-center text-[40px] md:text-[28px] font-semibold leading-normal">
        ORDER NOW
      </h2>
      <p className="text-[#86909C] text-center text-[24px] md:text-[14px] font-normal leading-normal max-w-[578px] md:max-w-none">
        Please note that orders need to be placed 48 hours (business days)
        ahead of pick up day.
      </p>
    </div>
  );
}
