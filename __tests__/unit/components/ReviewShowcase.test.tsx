import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, vi, beforeEach, expect } from 'vitest'

vi.mock('../../../lib/reviews', () => ({
  fetchReviews: vi.fn(),
}))

import { fetchReviews } from '../../../lib/reviews'

describe('ReviewShowcase unit', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('selects top 3 reviews, truncates long text and shows initials when photo missing', async () => {
    const longText = 'a'.repeat(200)
    const reviews = [
      { id: 'r1', author_name: 'Alice', author_photo_url: undefined, rating: 5, review_text: longText } ,
      { id: 'r2', author_name: 'Bob', author_photo_url: 'https://example.com/bob.jpg', rating: 4.5, review_text: 'Great' },
      { id: 'r3', author_name: 'Cara', author_photo_url: undefined, rating: 4.2, review_text: 'Nice' },
      { id: 'r4', author_name: 'Dan', author_photo_url: undefined, rating: 4.0, review_text: 'Ok' },
    ]

    ;(fetchReviews as unknown as any).mockResolvedValue(reviews)

    const mod = await import('../../../components/ReviewShowcase')
    // call async server component to obtain element tree
    // @ts-ignore
    const element = await mod.default()

    render(element)

    // Should show top 3 by rating: Alice, Bob, Cara
    expect(screen.getAllByText(/Alice/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Bob/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Cara/).length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/Dan/)).toBeNull()

    // Long text should be present and use the CSS clamp class (visual truncation)
    const clampedEls = document.querySelectorAll('.rs-text--clamp')
    expect(clampedEls.length).toBeGreaterThanOrEqual(1)
    const hasLong = Array.from(clampedEls).some((el) => (el.textContent || '').startsWith('a'))
    expect(hasLong).toBeTruthy()

    // Alice has no photo -> initial should be present
    expect(screen.getAllByText('A').length).toBeGreaterThan(0)
  })
})
