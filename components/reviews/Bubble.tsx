import Rating from "./Rating";
import Avatar from "./Avatar";

type BubbleProps = {
  authorName?: string | null;
  authorPhotoUrl?: string | null;
  rating: number;
  text: string;
  size?: "sm" | "md";
  right?: boolean;
  headerLeft?: boolean;
  className?: string;
};

export default function Bubble({
  authorName,
  authorPhotoUrl,
  rating,
  text,
  size = "md",
  right = false,
  headerLeft = false,
  className = "",
}: BubbleProps) {
  return (
    <div
      className={`rs-bubble rs-bubble--${size} ${right ? "rs-bubble--right" : ""} ${className}`.trim()}
    >
      <div className="rs-bubble-header">
        <div
          className={`rs-bubble-header-left flex flex-col ${headerLeft ? "items-start" : right ? "items-end" : "items-start"}`}
        >
          <p className="rs-author">{authorName}</p>
          <div className="mt-1">
            <Rating value={rating} size="sm" />
          </div>
        </div>
        <Avatar
          photoUrl={authorPhotoUrl}
          name={authorName ?? undefined}
          size={size}
          className="rs-avatar--bubble"
        />
      </div>
      <div className="rs-bubble-text">
        <p className="rs-text rs-text--clamp">{text}</p>
      </div>
    </div>
  );
}
