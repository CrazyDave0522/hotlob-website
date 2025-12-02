import Image from "next/image";
import { useState, useEffect } from "react";
import RatingStars from "@/app/our-locations/components/rating-stars";
import { ReviewData } from "@/lib/getReviews";

interface ReviewBubbleProps {
  review: ReviewData;
  position: "top" | "right" | "bottom" | "left";
}

export default function ReviewBubble({ review, position }: ReviewBubbleProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Bubble dimensions - responsive based on 1920px design, mobile override
  const bubbleWidth = isMobile ? "240px" : "min(12.5vw, 240px)"; // Mobile: 240px, Desktop: 240/1920
  const bubbleHeight = isMobile ? "140px" : "min(7.292vw, 140px)"; // Mobile: 140px, Desktop: 140/1920

  // Avatar dimensions - responsive, mobile override
  const avatarRingSize = isMobile ? "78px" : "min(3.646vw, 70px)"; // Mobile: 62px, Desktop: 70/1920
  const avatarSize = isMobile ? "54px" : "min(2.396vw, 46px)"; // Mobile: 54px, Desktop: 46/1920

  // Position configuration for each location
  // Avatar offset: controls how much of the avatar is outside the bubble
  // Mobile: 62% outside, 38% overlapped; Desktop: 60% outside, 40% overlapped
  const avatarOffset = isMobile ? "calc(78px * 0.62)" : "calc(min(3.646vw, 70px) * 0.6)";

  const positionConfig = {
    top: {
      // Top center, avatar at bottom-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        top: "0",
        left: "50%",
        transform: isMobile ? "translateX(calc(-50% + 100px))" : "translateX(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        bottom: `calc(-1 * ${avatarOffset})`,
        left: `calc(-1 * ${avatarOffset})`,
      },
    },
    right: {
      // Right middle, avatar at top-right corner of bubble
      containerStyle: {
        position: "absolute" as const,
        right: avatarOffset,
        top: `calc(50% - min(1.563vw, 30px))`, // 30/1920
        transform: "translateY(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        top: `calc(-1 * ${avatarOffset})`,
        right: `calc(-1 * ${avatarOffset})`,
      },
    },
    bottom: {
      // Bottom center, avatar at top-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        bottom: "min(0.521vw, 10px)", // 10/1920
        left: "50%",
        transform: isMobile ? "translateX(calc(-50% + 120px))" : "translateX(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        top: `calc(-1 * ${avatarOffset})`,
        left: `calc(-1 * ${avatarOffset})`,
      },
    },
    left: {
      // Left middle, avatar at bottom-right corner of bubble
      containerStyle: {
        position: "absolute" as const,
        left: "0",
        top: "50%",
        transform: isMobile ? "translateY(calc(-50% - 60px))" : `translateY(calc(-50% - min(1.042vw, 20px)))`, // 20/1920, mobile: 60px fixed
      },
      avatarStyle: {
        position: "absolute" as const,
        bottom: `calc(-1 * ${avatarOffset})`,
        right: `calc(-1 * ${avatarOffset})`,
      },
    },
  };

  const config = positionConfig[position];

  return (
    // ✅ 整个气泡组件作为hover目标
    <div
      style={{
        ...config.containerStyle,
        width: bubbleWidth,
        height: bubbleHeight,
        flexShrink: 0,
      }}
      className={`group transition-shadow duration-300 ease-out ${isMobile ? 'group-active:shadow-xl group-active:shadow-black/15 group-active:ring-1 group-active:ring-white/50' : 'group-hover:shadow-xl group-hover:shadow-black/15 group-hover:ring-1 group-hover:ring-white/50'}`}
    >
      {/* Avatar with decorative ring (lower z-index, behind bubble) */}
      {/* ✅ 头像轻微缩放 */}
      <div
        style={{
          ...config.avatarStyle,
          width: avatarRingSize,
          height: avatarRingSize,
          zIndex: 1,
        }}
        className={`transition-transform duration-300 ease-out ${isMobile ? 'group-active:scale-105' : 'group-hover:scale-105'}`}
      >
        {/* Decorative ring */}
        <Image
          src="/images/icons/avatar-ring.svg"
          alt=""
          width={isMobile ? 62 : 70}
          height={isMobile ? 62 : 70}
          style={{ width: "100%", height: "100%" }}
          className="absolute inset-0"
        />

        {/* Avatar image centered in ring */}
        {/* SVG ring center is at cx=35, cy=31 (not cy=35), so we need to adjust */}
        <div
          style={{
            position: "absolute",
            top: isMobile 
              ? "calc(50% - 4px)"  // Mobile: adjust for ring's cy≈27.5, move up 5px
              : "calc(50% - min(0.208vw, 4px))", // Desktop: adjust for ring's cy=31, 4/1920
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: avatarSize,
            height: avatarSize,
          }}
        >
          {review.author_photo_url ? (
            <Image
              src={review.author_photo_url}
              alt={review.author_name}
              width={isMobile ? 54 : 46}
              height={isMobile ? 54 : 46}
              style={{ width: "100%", height: "100%" }}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="rounded-full bg-gray-300"
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      </div>

      {/* Bubble with content (higher z-index, covers avatar) */}
      {/* ✅ 气泡强力缩放 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
        className={`transition-transform duration-300 ease-out ${isMobile ? 'group-active:scale-[1.08]' : 'group-hover:scale-[1.08]'}`}
      >
        {/* Bubble background */}
        <Image
          src="/images/dialog-bubble.svg"
          alt=""
          fill
          sizes="(max-width:750px) calc((240 / 750) * 100vw), 240px"
          className="object-cover"
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "10px" : "min(0.521vw, 10px)", // Mobile: 10px fixed, Desktop: 10/1920
            left: isMobile ? "10px" : "min(0.625vw, 12px)", // Mobile: 10px fixed, Desktop: 12/1920
            right: isMobile ? "8px" : "min(0.625vw, 12px)", // Mobile: 8px fixed, Desktop: 12/1920
            bottom: isMobile ? "10px" : "min(0.729vw, 14px)", // Mobile: 10px fixed, Desktop: 14/1920
            display: "flex",
            flexDirection: "column",
            gap: "min(0.521vw, 10px)", // 10/1920
          }}
        >
          {/* Author name */}
          <div
            style={{
              color: "#1D1E1F",
              fontSize: isMobile ? "12px" : "min(0.625vw, 12px)", // Mobile: 12px fixed, Desktop: 12/1920
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {review.author_name}
          </div>

          {/* Rating */}
          <RatingStars rating={review.rating} size="small" />

          {/* Review text (max 4 lines on mobile, 3 on desktop with ellipsis) */}
          <div
            style={{
              color: "#4E5969",
              fontSize: isMobile ? "12px" : "min(0.625vw, 12px)", // Mobile: 12px fixed, Desktop: 12/1920
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: isMobile ? 4 : 3,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
          >
            {review.review_text}
          </div>
        </div>
      </div>
    </div>
  );
}
