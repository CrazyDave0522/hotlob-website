"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import HeroTexts from "./components/hero-texts";
import FormTitle from "./components/form-title";
import CateringForm from "./components/catering-form";
// layout constants are in ./constants but not needed here

export default function CateringPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="relative w-full">
        {/* Hero section with background */}
        <div className="relative w-full mx-auto aspect-750/830">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/images/catering-bg-mb.png"
              alt=""
              fill
              sizes="(max-width:750px) 100vw, 750px"
              priority
              className="object-contain object-top"
            />
          </div>
          <div className="relative w-full h-full">
            <HeroTexts isMobile={true} />
            <FormTitle isMobile={true} />
          </div>
        </div>

        {/* Form section with background */}
        <div className="relative w-full mx-auto aspect-750/1350">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/images/catering-form-bg-mb.png"
              alt=""
              fill
              sizes="(max-width:750px) 100vw, 750px"
              priority
              className="object-contain object-top"
            />
          </div>
          <div className="relative w-full h-full">
            <CateringForm isMobile={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Background images - desktop and mobile with Next.js Image optimization */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Desktop background */}
        <Image
          src="/images/catering-bg.png"
          alt=""
          fill
          sizes="(max-width:750px) 100vw, 1920px"
          priority
          className="object-contain object-top hidden md:block"
        />
      </div>

      {/* Content overlay - width controlled by layout.tsx max-w-[1920px] wrapper */}
      {/* Height based on background aspect ratio: 1920x1589 desktop, 750x669 mobile */}
      <div className="relative w-full mx-auto aspect-750/669 md:aspect-1920/1589">
        {/* Hero texts: CATERING, The ULTIMATE picnic set!, MIX 16 ROLL SET */}
        <HeroTexts />

        {/* Form title: ORDER NOW - centered relative to page */}
        <FormTitle />

        {/* Order form: positioned bottom-left */}
        <CateringForm />
      </div>
    </div>
  );
}
