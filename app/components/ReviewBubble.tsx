import Image from "next/image";
import RatingStars from "@/app/our-locations/components/rating-stars";
import { ReviewData } from "@/lib/getReviews";

interface ReviewBubbleProps {
  review: ReviewData;
  position: "top" | "right" | "bottom" | "left";
}

export default function ReviewBubble({ review, position }: ReviewBubbleProps) {
  // Mobile-first fluid sizes scaled from 750 baseline with upper desktop caps
  const bubbleWidth = "clamp(200px, calc((240 / 750) * 100vw), 240px)";
  const bubbleHeight = "clamp(120px, calc((140 / 750) * 100vw), 140px)";
  const avatarRingSize = "clamp(60px, calc((70 / 750) * 100vw), 70px)";
  const avatarSize = "clamp(40px, calc((46 / 750) * 100vw), 46px)";
  const avatarOffset = "calc(" + avatarRingSize + " * 0.6)"; // keep 60% outside overlap

  const positionConfig = {
    top: {
      // Top center, avatar at bottom-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
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
        width: bubbleWidth,
        height: bubbleHeight,
        flexShrink: 0,
      }}
      className="group transition-shadow duration-300 ease-out group-hover:shadow-xl group-hover:shadow-black/15 group-hover:ring-1 group-hover:ring-white/50"
    >
      {/* Avatar with decorative ring (lower z-index, behind bubble) */}
      {/* Subtle avatar scale on hover */}
      <div
        style={{
          ...config.avatarStyle,
          width: avatarRingSize,
          height: avatarRingSize,
          zIndex: 1,
        }}
        className="transition-transform duration-300 ease-out group-hover:scale-105"
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
            width: avatarSize,
            height: avatarSize,
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
        className="transition-transform duration-300 ease-out group-hover:scale-[1.08]"
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
            top: "min(0.521vw, 10px)",
            left: "min(0.625vw, 12px)",
            right: "min(0.625vw, 12px)",
            bottom: "min(0.729vw, 14px)",
            display: "flex",
            flexDirection: "column",
            gap: "min(0.521vw, 10px)", // 10/1920
          }}
        >
          {/* Author name */}
          <div
            style={{
              color: "#1D1E1F",
              fontSize: "min(0.625vw, 12px)",
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
              fontSize: "min(0.625vw, 12px)",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
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
