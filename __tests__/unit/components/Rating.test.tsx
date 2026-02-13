import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Rating from '../../../components/Rating'

describe('Rating', () => {
  describe('Star Display', () => {
    it('renders full stars correctly', () => {
      render(<Rating value={4.0} />)

      const fullStars = screen.getAllByAltText('Full star')
      expect(fullStars).toHaveLength(4)

      const halfStars = screen.queryAllByAltText('Half star')
      expect(halfStars).toHaveLength(0)

      const emptyStars = screen.queryAllByAltText('Empty star')
      expect(emptyStars).toHaveLength(1)
    })

    it('renders half star correctly', () => {
      render(<Rating value={4.5} />)

      const fullStars = screen.getAllByAltText('Full star')
      expect(fullStars).toHaveLength(4)

      const halfStars = screen.getAllByAltText('Half star')
      expect(halfStars).toHaveLength(1)

      const emptyStars = screen.queryAllByAltText('Empty star')
      expect(emptyStars).toHaveLength(0)
    })

    it('renders empty stars correctly', () => {
      render(<Rating value={2.0} />)

      const fullStars = screen.getAllByAltText('Full star')
      expect(fullStars).toHaveLength(2)

      const halfStars = screen.queryAllByAltText('Half star')
      expect(halfStars).toHaveLength(0)

      const emptyStars = screen.queryAllByAltText('Empty star')
      expect(emptyStars).toHaveLength(3)
    })

    it('renders zero rating correctly', () => {
      render(<Rating value={0} />)

      const fullStars = screen.queryAllByAltText('Full star')
      expect(fullStars).toHaveLength(0)

      const halfStars = screen.queryAllByAltText('Half star')
      expect(halfStars).toHaveLength(0)

      const emptyStars = screen.queryAllByAltText('Empty star')
      expect(emptyStars).toHaveLength(5)
    })

    it('renders perfect rating correctly', () => {
      render(<Rating value={5.0} />)

      const fullStars = screen.getAllByAltText('Full star')
      expect(fullStars).toHaveLength(5)

      const halfStars = screen.queryAllByAltText('Half star')
      expect(halfStars).toHaveLength(0)

      const emptyStars = screen.queryAllByAltText('Empty star')
      expect(emptyStars).toHaveLength(0)
    })
  })

  describe('Numeric Display', () => {
    it('displays rating value with one decimal place', () => {
      render(<Rating value={4.5} />)

      expect(screen.getByText('4.5')).toBeInTheDocument()
    })

    it('displays whole number ratings correctly', () => {
      render(<Rating value={4.0} />)

      expect(screen.getByText('4.0')).toBeInTheDocument()
    })

    it('displays zero rating correctly', () => {
      render(<Rating value={0} />)

      expect(screen.getByText('0.0')).toBeInTheDocument()
    })
  })

  describe('Size Variants', () => {
    it('applies small size class by default', () => {
      render(<Rating value={4.0} />)

      const container = screen.getByText('4.0').closest('[data-size]')
      expect(container).toHaveAttribute('data-size', 'sm')
    })

    it('applies medium size class', () => {
      render(<Rating value={4.0} size="md" />)

      const container = screen.getByText('4.0').closest('[data-size]')
      expect(container).toHaveAttribute('data-size', 'md')
    })

    it('applies large size class', () => {
      render(<Rating value={4.0} size="lg" />)

      const container = screen.getByText('4.0').closest('[data-size]')
      expect(container).toHaveAttribute('data-size', 'lg')
    })
  })

  describe('Styling and Layout', () => {
    it('has correct CSS classes', () => {
      render(<Rating value={4.0} />)

      const container = screen.getByText('4.0').closest('[data-size]')
      expect(container).toHaveAttribute('data-size', 'sm')
      expect(container).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Rating value={4.0} className="custom-rating" />)

      const container = screen.getByText('4.0').closest('[data-size]')
      expect(container).toHaveClass('custom-rating')
    })
  })

  describe('Accessibility', () => {
    it('has proper alt text for star images', () => {
      render(<Rating value={3.5} />)

      expect(screen.getAllByAltText('Full star')).toHaveLength(3)
      expect(screen.getAllByAltText('Half star')).toHaveLength(1)
      expect(screen.queryAllByAltText('Empty star')).toHaveLength(1)
    })

    it('renders star images with correct dimensions', () => {
      render(<Rating value={4.0} />)

      const stars = screen.getAllByAltText(/star/i)
      stars.forEach(star => {
        expect(star).toHaveAttribute('width', '16')
        expect(star).toHaveAttribute('height', '16')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles decimal values correctly', () => {
      render(<Rating value={3.7} />)

      // 3.7 should show 3 full stars, 1 half star, 1 empty star
      expect(screen.getAllByAltText('Full star')).toHaveLength(3)
      expect(screen.getAllByAltText('Half star')).toHaveLength(1)
      expect(screen.queryAllByAltText('Empty star')).toHaveLength(1)
    })

    it('handles values greater than 5', () => {
      render(<Rating value={6.0} />)

      // Should still only show 5 stars
      expect(screen.getAllByAltText('Full star')).toHaveLength(5)
      expect(screen.getByText('6.0')).toBeInTheDocument()
    })

    it('handles negative values', () => {
      render(<Rating value={-1} />)

      // Should show 0 full stars, 5 empty stars
      expect(screen.queryAllByAltText('Full star')).toHaveLength(0)
      expect(screen.queryAllByAltText('Empty star')).toHaveLength(5)
      expect(screen.getByText('-1.0')).toBeInTheDocument()
    })
  })
})