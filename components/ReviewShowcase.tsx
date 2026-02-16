import Image from "next/image";

/**
 * ReviewShowcase - Background images for the store showcase section
 *
 * Displays different background images for desktop and mobile:
 * - Desktop: Right side background image
 * - Mobile: Bottom background image below the store list
 */
export function ReviewShowcase() {
  return (
    <>
      {/* Desktop background image - right side */}
      <div className="hidden md:block relative">
        <Image
          src="/images/section-bg/home-bg-locations-review.png"
          alt="Locations and reviews background"
          fill
          className="object-contain"
        />
      </div>

      {/* Mobile background image - below store list */}
      <div className="md:hidden relative aspect-4/3">
        <Image
          src="/images/section-bg/home-bg-locations-review-mb.png"
          alt="Locations and reviews background mobile"
          fill
          className="object-contain"
        />
      </div>
    </>
  );
}