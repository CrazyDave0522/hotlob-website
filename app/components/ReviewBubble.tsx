import Image from "next/image";
import RatingStars from "@/app/our-locations/components/rating-stars";
import { ReviewData } from "@/lib/getReviews";

interface ReviewBubbleProps {
  review: ReviewData;
  position: "top" | "right" | "bottom" | "left";
}

export default function ReviewBubble({ review, position }: ReviewBubbleProps) {
  // Helper function for responsive values
  const responsive = (px: number) => `min(${(px / 1920 * 100).toFixed(3)}vw, ${px}px)`;
  
  // Bubble dimensions
  const bubbleWidth = 240;
  const bubbleHeight = 140;
  
  // Avatar dimensions
  const avatarRingSize = 70;
  const avatarSize = 46;  // Position configuration for each location
  // Avatar offset: controls how much of the avatar is outside the bubble
  const avatarOffset = responsive(avatarRingSize * 0.6); // 60% outside, 40% overlapped by bubble corner

  const positionConfig = {
    top: {
      // Top center, avatar at bottom-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        top: responsive(0),
        left: "50%",
        transform: "translateX(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        bottom: `-${avatarOffset}`,
        left: `-${avatarOffset}`,
      },
    },
    right: {
      // Right middle, avatar at top-right corner of bubble
      containerStyle: {
        position: "absolute" as const,
        right: avatarOffset,
        top: `calc(50% - ${responsive(30)})`,
        transform: "translateY(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        top: `-${avatarOffset}`,
        right: `-${avatarOffset}`,
      },
    },
    bottom: {
      // Bottom center, avatar at top-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        bottom: responsive(10),
        left: "50%",
        transform: "translateX(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        top: `-${avatarOffset}`,
        left: `-${avatarOffset}`,
      },
    },
    left: {
      // Left middle, avatar at bottom-right corner of bubble
      containerStyle: {
        position: "absolute" as const,
        left: responsive(0),
        top: "50%",
        transform: `translateY(calc(-50% - ${responsive(20)}))`,
      },
      avatarStyle: {
        position: "absolute" as const,
        bottom: `-${avatarOffset}`,
        right: `-${avatarOffset}`,
      },
    },
  };

  const config = positionConfig[position];

  return (
    // ✅ 整个气泡组件作为hover目标
    <div
      style={{
        ...config.containerStyle,
        width: responsive(bubbleWidth),
        height: responsive(bubbleHeight),
        flexShrink: 0,
      }}
      className="group transition-all duration-300 ease-out group-hover:shadow-xl group-hover:shadow-black/15 group-hover:ring-1 group-hover:ring-white/50"
    >
      {/* Avatar with decorative ring (lower z-index, behind bubble) */}
      {/* ✅ 头像轻微缩放 */}
      <div
        style={{
          ...config.avatarStyle,
          width: responsive(avatarRingSize),
          height: responsive(avatarRingSize),
          zIndex: 1,
        }}
        className="transition-transform duration-300 ease-out group-hover:scale-105"
      >
        {/* Decorative ring */}
        <Image
          src="/images/icons/avatar-ring.svg"
          alt=""
          width={avatarRingSize}
          height={avatarRingSize}
          className="absolute inset-0"
        />

        {/* Avatar image centered in ring */}
        {/* SVG ring center is at cx=35, cy=31 (not cy=35), so we need to adjust */}
        <div
          style={{
            position: "absolute",
            top: "calc(50% - 4px)", // Adjust for ring's cy=31 instead of cy=35
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: responsive(avatarSize),
            height: responsive(avatarSize),
          }}
        >
          {review.author_photo_url ? (
            <Image
              src={review.author_photo_url}
              alt={review.author_name}
              width={avatarSize}
              height={avatarSize}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="rounded-full bg-gray-300"
              style={{ width: responsive(avatarSize), height: responsive(avatarSize) }}
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
        className="transition-transform duration-300 ease-out group-hover:scale-[1.08]"
      >
        {/* Bubble background */}
        <Image
          src="/images/dialog-bubble.svg"
          alt=""
          fill
          sizes="min(12.5vw, 240px)"
          className="object-cover"
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: responsive(10), // 10px responsive
            left: responsive(12), // 12px responsive
            right: responsive(12), // 12px responsive
            bottom: responsive(14), // 14px responsive
            display: "flex",
            flexDirection: "column",
            gap: responsive(10), // 10px responsive
          }}
        >
          {/* Author name */}
          <div
            style={{
              color: "#1D1E1F",
              fontSize: responsive(12), // 12px responsive
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {review.author_name}
          </div>

          {/* Rating */}
          <RatingStars rating={review.rating} size="small" />

          {/* Review text (max 3 lines with ellipsis) */}
          <div
            style={{
              color: "#4E5969",
              fontSize: responsive(12), // 12px responsive
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
