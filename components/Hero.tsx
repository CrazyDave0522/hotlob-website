"use client";

import * as React from "react";
import Image from "next/image";
import "@/styles/components/layout/hero.css";

interface HeroProps {
  variant: "tall" | "short";
  bgImage: string;
  mobileBgImage?: string;
  title: string;
  subtitle: string;
  overlay?: boolean;
}

export default function Hero({
  variant,
  bgImage,
  mobileBgImage,
  title,
  subtitle,
  overlay = true,
}: HeroProps) {
  // Determine if we should use mobile variant (client-side)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Check viewport width on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use mobile image if available and viewport is mobile
  const backgroundImageUrl =
    isMobile && mobileBgImage ? mobileBgImage : bgImage;

  // Determine if overlay should be shown (varies by viewport)
  const showOverlay = overlay
    ? isMobile
      ? "overlay-mb.png"
      : "overlay.png"
    : null;

  const rootClass = `Hero-root Hero-root--${variant}${!overlay ? " Hero-root--no-overlay" : ""}`;

  return (
    <div className={rootClass}>
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="Hero-bgImage"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Overlay (optional) */}
      {showOverlay && (
        <Image
          src={`/images/hero-bg/${showOverlay}`}
          alt=""
          fill
          className="Hero-overlay"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}

      {/* Text Content */}
      <div className="Hero-content">
        <div className="Hero-textContainer">
          <h1 className="Hero-title">{title}</h1>
          <p className="Hero-subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
