import Image from "next/image";
import RatingStars from "@/app/our-locations/components/rating-stars";
import { ReviewData } from "@/lib/getReviews";

interface ReviewBubbleProps {
  review: ReviewData;
  position: "top" | "right" | "bottom" | "left";
}

export default function ReviewBubble({ review, position }: ReviewBubbleProps) {
  // Bubble dimensions
  const bubbleWidth = 240;
  const bubbleHeight = 140;

  // Avatar dimensions
  const avatarRingSize = 70;
  const avatarSize = 46;

  // Position configuration for each location
  // Avatar offset: controls how much of the avatar is outside the bubble
  const avatarOffset = avatarRingSize * 0.6; // 60% outside, 40% overlapped by bubble corner

  const positionConfig = {
    top: {
      // Top center, avatar at bottom-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        top: "0px",
        left: "50%",
        transform: "translateX(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        bottom: `-${avatarOffset}px`,
        left: `-${avatarOffset}px`,
      },
    },
    right: {
      // Right middle, avatar at top-right corner of bubble
      containerStyle: {
        position: "absolute" as const,
        right: `${avatarOffset}px`,
        top: "50%",
        transform: "translateY(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        top: `-${avatarOffset}px`,
        right: `-${avatarOffset}px`,
      },
    },
    bottom: {
      // Bottom center, avatar at top-left corner of bubble
      containerStyle: {
        position: "absolute" as const,
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        top: `-${avatarOffset}px`,
        left: `-${avatarOffset}px`,
      },
    },
    left: {
      // Left middle, avatar at bottom-right corner of bubble
      containerStyle: {
        position: "absolute" as const,
        left: "0px",
        top: "50%",
        transform: "translateY(-50%)",
      },
      avatarStyle: {
        position: "absolute" as const,
        bottom: `-${avatarOffset}px`,
        right: `-${avatarOffset}px`,
      },
    },
  };

  const config = positionConfig[position];

  return (
    // ✅ 整个气泡组件作为hover目标
    <div
      style={{
        ...config.containerStyle,
        width: `${bubbleWidth}px`,
        height: `${bubbleHeight}px`,
        flexShrink: 0,
      }}
      className="group transition-shadow duration-300 ease-out group-hover:shadow-xl group-hover:shadow-black/15 group-hover:ring-1 group-hover:ring-white/50"
    >
      {/* Avatar with decorative ring (lower z-index, behind bubble) */}
      {/* ✅ 头像轻微缩放 */}
      <div
        style={{
          ...config.avatarStyle,
          width: `${avatarRingSize}px`,
          height: `${avatarRingSize}px`,
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
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
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
              style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
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
          sizes="240px"
          className="object-cover"
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "12px",
            right: "12px",
            bottom: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Author name */}
          <div
            style={{
              color: "#1D1E1F",
              fontSize: "12px",
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
              fontSize: "12px",
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
