"use client";

import Image from "next/image";
import HeroTexts from "./components/hero-texts";
import FormTitle from "./components/form-title";
import CateringForm from "./components/catering-form";
// layout constants are in ./constants but not needed here

export default function CateringPage() {
  return (
    <div className="relative w-full">
      {/* Mobile Hero section */}
      <div className="relative w-full mx-auto aspect-750/830 md:hidden bg-[#D43B41] overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/catering-bg-mb.png"
            alt=""
            fill
            sizes="(max-width:750px) 100vw, 750px"
            priority
            className="object-cover object-top"
          />
        </div>
        <div className="relative w-full h-full">
          <HeroTexts />
          <FormTitle />
        </div>
      </div>

      {/* Mobile Form section */}
      <div
        className="relative w-full mx-auto md:hidden bg-[#D43B41] overflow-hidden"
        style={{ height: 'clamp(760px, calc(1350/750*100vw), 1350px)' }}
      >
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/catering-form-bg-mb.png"
            alt=""
            fill
            sizes="(max-width:750px) 100vw, 750px"
            priority
            className="object-cover object-top"
          />
        </div>
        <div className="relative w-full h-full">
          <CateringForm />
        </div>
      </div>

      {/* Desktop combined section */}
      <div className="hidden md:block relative w-full">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/catering-bg.png"
            alt=""
            fill
            sizes="1920px"
            priority
            className="object-contain object-top"
          />
        </div>
        <div className="relative w-full mx-auto aspect-1920/1589">
          <HeroTexts />
          <FormTitle />
          <CateringForm />
        </div>
      </div>
    </div>
  );
}
