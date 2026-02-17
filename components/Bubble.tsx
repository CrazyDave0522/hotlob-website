import Rating from "./Rating";

type BubbleProps = {
  authorName?: string | null;
  rating: number;
  text: string;
  size?: "sm" | "md";
  right?: boolean;
  headerLeft?: boolean;
  className?: string;
};

export default function Bubble({
  authorName,
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
      <div
        className={`flex flex-col ${headerLeft ? "items-start" : right ? "items-end" : "items-start"}`}
      >
        <p className="rs-author">{authorName}</p>
        <div className="mt-1">
          <Rating value={rating} size="sm" />
        </div>
      </div>
      <p className="rs-text rs-text--clamp mt-2">{text}</p>
    </div>
  );
}
