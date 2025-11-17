import HeroTexts from "./components/hero-texts";
import FormTitle from "./components/form-title";
import CateringForm from "./components/catering-form";

export default function CateringPage() {
  return (
    <div className="relative w-full">
      {/* Background canvas - desktop bg, switches to mobile at md: breakpoint */}
      <div
        className="absolute inset-0 bg-contain bg-top bg-no-repeat md:bg-[url('/images/catering-bg.png')] bg-[url('/images/catering-bg-mobile.png')]"
        aria-hidden="true"
      />

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
