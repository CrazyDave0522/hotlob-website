import React from 'react'
import Image from 'next/image'
import '@/styles/components/rating.css'

interface RatingProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Rating({ value, size = 'sm', className }: RatingProps) {
  const clampedValue = Math.max(0, Math.min(5, value))
  const fullStars = Math.floor(clampedValue)
  const hasHalfStar = clampedValue % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const stars = []

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Image
        key={`full-${i}`}
        src="/images/icons/star-filled.svg"
        alt="Full star"
        width={16}
        height={16}
        className="rating-star"
      />
    )
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <Image
        key="half"
        src="/images/icons/star-half.svg"
        alt="Half star"
        width={16}
        height={16}
        className="rating-star"
      />
    )
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Image
        key={`empty-${i}`}
        src="/images/icons/star-empty.svg"
        alt="Empty star"
        width={16}
        height={16}
        className="rating-star"
      />
    )
  }

  return (
    <div className={`rating rating-${size} ${className || ''}`} data-size={size}>
      <div className="rating-stars">
        {stars}
      </div>
      <span className="rating-value">{value.toFixed(1)}</span>
    </div>
  )
}