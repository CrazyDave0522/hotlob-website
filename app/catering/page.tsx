import Image from "next/image";
import HeroTexts from "./components/hero-texts";
import FormTitle from "./components/form-title";
import CateringForm from "./components/catering-form";
import { CATERING_LAYOUT } from "./constants";

export default function CateringPage() {
  return (
    <div className="relative w-full">
      {/* Background images - desktop and mobile with Next.js Image optimization */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Desktop background */}
        <Image
          src="/images/catering-bg.png"
          alt=""
          fill
          priority
          className="object-contain object-top hidden md:block"
        />
        {/* Mobile background */}
        <Image
          src="/images/catering-bg-mobile.png"
          alt=""
          fill
          priority
          className="object-contain object-top md:hidden"
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
