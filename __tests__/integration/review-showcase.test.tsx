import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, vi, beforeEach, expect } from 'vitest'

vi.mock('../../lib/reviews', () => ({
  fetchReviews: vi.fn(),
}))

import { fetchReviews } from '../../lib/reviews'

describe('ReviewShowcase integration snapshot', () => {
  beforeEach(() => vi.resetAllMocks())

  it('renders mobile-first bubbles and matches snapshot', async () => {
    const reviews = [
      { id: 'r1', author_name: 'Alice', author_photo_url: undefined, rating: 5, review_text: 'Great food' },
      { id: 'r2', author_name: 'Bob', author_photo_url: undefined, rating: 4.5, review_text: 'Nice' },
      { id: 'r3', author_name: 'Cara', author_photo_url: undefined, rating: 4.2, review_text: 'Lovely' },
    ]

    ;(fetchReviews as unknown as any).mockResolvedValue(reviews)

    const mod = await import('../../components/reviews/ReviewShowcase')
    // @ts-ignore
    const element = await mod.default()

    const { container } = render(element)
    // Ensure top-2 mobile bubbles render and author names are present only for those two
    const mobileWrapper = container.querySelector('[class*="md:hidden"]')
    // mobile and desktop both render bubbles in the server output; target mobile only
    expect(mobileWrapper?.querySelectorAll('.rs-bubble').length).toBe(2)
    expect(mobileWrapper?.textContent).toContain('Alice')
    expect(mobileWrapper?.textContent).toContain('Bob')
    expect(mobileWrapper?.textContent).not.toContain('Cara')
  })
})
