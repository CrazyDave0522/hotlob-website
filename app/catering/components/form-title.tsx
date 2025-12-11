"use client";


export default function FormTitle() {
  return (
    <div className="form-title-container">
      <h2 className="catering-form-title text-[#1D1E1F] text-center font-semibold leading-normal">
        ORDER NOW
      </h2>
      <p 
        className="catering-form-desc text-[#86909C] text-center font-normal leading-normal md:max-w-none"
      >
        Please note that orders need to be placed 48 hours (2 business days)
        ahead of pick up day.
      </p>
      
    </div>
  );
}
