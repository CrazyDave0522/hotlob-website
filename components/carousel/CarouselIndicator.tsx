import { CarouselIndicatorProps } from "@/types/carousel";

/**
 * CarouselIndicator - Navigation indicators for carousel
 *
 * Displays dots indicating the current position and total number of items.
 * Only renders when there are multiple items (total > 1).
 *
 * @param props - Component props
 * @param props.total - Total number of carousel items
 * @param props.current - Current active item index (0-based)
 * @param props.onClick - Callback function when indicator is clicked
 */
export function CarouselIndicator({
  total,
  current,
  onClick,
}: CarouselIndicatorProps) {
  if (total <= 1) {
    return null; // Don't show indicators for single item
  }

  return (
    <div className="carousel-indicators">
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          className={`carousel-indicator ${index === current ? "active" : "inactive"}`}
          onClick={() => onClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
