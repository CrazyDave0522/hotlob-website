import Image from "next/image";
import RatingStars from "@/app/our-locations/components/rating-stars";
import { ReviewData } from "@/lib/getReviews";
import { useEffect, useState } from "react";

interface ReviewBubbleProps {
  review: ReviewData;
  position: "top" | "right" | "bottom" | "left";
}

export default function ReviewBubble({ review, position }: ReviewBubbleProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setIsCompactMobile(width <= 420);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Responsive sizes: 750px baseline for mobile, seamlessly scale to desktop
  // Bubble ratio maintained: 300:175
  const bubbleWidth = "clamp(150px, calc((300 / 750) * 100vw), 300px)";
  const bubbleHeight = "clamp(87.5px, calc((175 / 750) * 100vw), 175px)";
  const avatarRingSize = "clamp(35px, calc((70 / 750) * 100vw), 70px)";
  const avatarSize = "clamp(23px, calc((46 / 750) * 100vw), 46px)";
  
  const finalBubbleWidth = bubbleWidth;
  const finalBubbleHeight = bubbleHeight;
  const finalAvatarRingSize = avatarRingSize;
  const finalAvatarSize = avatarSize;
  
  const avatarOffset = "calc(" + finalAvatarRingSize + " * 0.6)"; // keep 60% outside overlap

  const positionConfig = {
    top: {
      // Top left, avatar at bottom-left corner of bubble, avatar's left edge touches container left
      containerStyle: {
        position: "absolute" as const,
        top: "0",
        left: avatarOffset,
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
        transform: "translateX(-50%)",
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
        transform: `translateY(calc(-50% - min(1.042vw, 20px)))`,
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
    // Entire bubble acts as the hover target
    <div
      style={{
        ...config.containerStyle,
        width: finalBubbleWidth,
        height: finalBubbleHeight,
        flexShrink: 0,
      }}
      className="review-bubble group transition-shadow duration-300 ease-out group-hover:shadow-xl group-hover:shadow-black/15 group-hover:ring-1 group-hover:ring-white/50 group-active:shadow-xl group-active:shadow-black/15 group-active:ring-1 group-active:ring-white/50"
    >
      {/* Avatar with decorative ring (lower z-index, behind bubble) */}
      {/* Subtle avatar scale on hover */}
      <div
        style={{
          ...config.avatarStyle,
          width: finalAvatarRingSize,
          height: finalAvatarRingSize,
          zIndex: 1,
        }}
        className="review-bubble-avatar transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-105"
      >
        {/* Decorative ring */}
        <Image
          src="/images/icons/avatar-ring.svg"
          alt=""
          width={70}
          height={70}
          style={{ width: "100%", height: "100%" }}
          className="absolute inset-0"
        />

        {/* Avatar image centered in ring */}
        {/* SVG ring center is at cx=35, cy=31 (not cy=35), so we need to adjust */}
        <div
          style={{
            position: "absolute",
            top: "calc(50% - min(0.208vw, 4px))",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: finalAvatarSize,
            height: finalAvatarSize,
          }}
        >
          {review.author_photo_url ? (
            <Image
              src={review.author_photo_url}
              alt={review.author_name}
              width={46}
              height={46}
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
      {/* Stronger bubble scale on hover */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
        className="transition-transform duration-300 ease-out group-hover:scale-[1.08] group-active:scale-[1.08]"
      >
        {/* Bubble background */}
        <Image
          src="/images/dialog-bubble.svg"
          alt=""
          fill
          sizes="(max-width:750px) calc((300 / 750) * 100vw), 300px"
          className="object-cover"
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: "clamp(6px, calc((12 / 750) * 100vw), 12px)",
            left: "clamp(6px, calc((12 / 750) * 100vw), 12px)",
            right: "clamp(6px, calc((12 / 750) * 100vw), 12px)",
            bottom: "clamp(6px, calc((12 / 750) * 100vw), 12px)",
            display: "flex",
            flexDirection: "column",
            gap: "min(0.521vw, 10px)", // 10/1920
          }}
        >
          {/* Author name */}
          <div
            style={{
              color: "#1D1E1F",
              fontSize: "clamp(10px, calc((16 / 750) * 100vw), 16px)",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {review.author_name}
          </div>

          {/* Rating */}
          <RatingStars rating={review.rating} variant="review-bubble" />

          {/* Review text (max 4 lines on mobile, 3 on desktop with ellipsis) */}
          <div
            style={{
              color: "#4E5969",
              fontSize: "clamp(10px, calc((16 / 750) * 100vw), 16px)",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: isDesktop ? 3 : isCompactMobile ? 3 : 4,
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
