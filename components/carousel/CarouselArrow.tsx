import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselArrowProps } from '@/types/carousel';

/**
 * CarouselArrow - Navigation arrow button for carousel
 *
 * Displays left/right arrow buttons using Lucide React icons.
 * Handles click events for carousel navigation.
 *
 * @param props - Component props
 * @param props.direction - Arrow direction ('left' or 'right')
 * @param props.onClick - Callback function when arrow is clicked
 * @param props.disabled - Whether the arrow is disabled (optional)
 */
export function CarouselArrow({ direction, onClick, disabled = false }: CarouselArrowProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      className={`carousel-arrow carousel-arrow-${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
    >
      <Icon size={24} />
    </button>
  );
}