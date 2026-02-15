import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CustomerReviews from '../../../components/CustomerReviews'
import { fetchReviews } from '../../../lib/reviews'

// Mock the fetchReviews function
vi.mock('../../../lib/reviews', () => ({
  fetchReviews: vi.fn()
}))

const mockReviews = [
  {
    id: '1',
    store_id: 'store-1',
    google_review_id: 'google-1',
    author_name: 'John Doe',
    author_photo_url: 'https://example.com/photo.jpg',
    rating: 5,
    review_text: 'Great food and service!',
    review_time: '2024-01-15T10:00:00Z',
    language: 'en',
    fetched_at: '2024-01-15T10:00:00Z',
    expires_at: '2024-02-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    store_id: 'store-1',
    google_review_id: 'google-2',
    author_name: 'Jane Smith',
    rating: 4,
    review_text: 'Good experience overall.',
    review_time: '2024-01-10T10:00:00Z',
    language: 'en',
    fetched_at: '2024-01-10T10:00:00Z',
    expires_at: '2024-02-10T10:00:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  }
]

describe('CustomerReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('shows loading spinner initially', () => {
      vi.mocked(fetchReviews).mockImplementation(() => new Promise(() => {}))
      render(<CustomerReviews />)

      expect(screen.getByLabelText('Loading customer reviews')).toBeInTheDocument()
      expect(screen.getByText('Loading customer reviews...')).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    it('renders reviews when data is loaded', async () => {
      vi.mocked(fetchReviews).mockResolvedValue(mockReviews)
      render(<CustomerReviews />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      })

      expect(screen.getByText('Great food and service!')).toBeInTheDocument()
      expect(screen.getByText('Good experience overall.')).toBeInTheDocument()
    })

    it('formats dates in Australian format', async () => {
      vi.mocked(fetchReviews).mockResolvedValue([mockReviews[0]])
      render(<CustomerReviews />)

      await waitFor(() => {
        expect(screen.getByText('15 January 2024')).toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('does not render when no reviews are available', async () => {
      vi.mocked(fetchReviews).mockResolvedValue([])
      const { container } = render(<CustomerReviews />)

      await waitFor(() => {
        expect(container.firstChild).toBeNull()
      })
    })
  })

  describe('Error State', () => {
    it('shows error message when fetch fails', async () => {
      vi.mocked(fetchReviews).mockRejectedValue(new Error('Network error'))
      render(<CustomerReviews />)

      await waitFor(() => {
        expect(screen.getByText('Failed to load customer reviews. Please try again later.')).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })
  })
})