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

      {/* Content overlay - constrained to max-width for alignment */}
      {/* Height based on background aspect ratio: 1920x1589 desktop, 750x669 mobile */}
      <div className="relative max-w-[1920px] mx-auto aspect-750/669 md:aspect-1920/1589">
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
