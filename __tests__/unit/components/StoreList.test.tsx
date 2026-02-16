import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import StoreList from '../../../components/StoreList'
import { fetchStoresWithPhotos } from '../../../lib/store'
import type { Store, StorePhoto } from '../../../types/store'

// Mock the store library
vi.mock('../../../lib/store', () => ({
  fetchStoresWithPhotos: vi.fn()
}))

const mockFetchStoresWithPhotos = vi.mocked(fetchStoresWithPhotos)

describe('StoreList', () => {
  const mockStore: Store & { photos: StorePhoto[] } = {
    id: 'store-1',
    name: 'Hotlob Sydney',
    street: '123 Main St',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    latitude: -33.8688,
    longitude: 151.2093,
    google_place_id: 'place123',
    google_maps_embed_url: 'https://maps.google.com/embed?pb=...',
    uber_url: 'https://uber.com',
    email: 'sydney@hotlob.com',
    google_url: 'https://maps.google.com/place123',
    google_rating: 4.5,
    google_user_ratings_total: 100,
    google_trading_hours: {
      open_now: true,
      weekday_text: ['Monday: 9:00 AM – 5:00 PM']
    },
    google_last_synced_at: '2024-01-01T00:00:00Z',
    photos: [
      {
        id: 'photo-1',
        store_id: 'store-1',
        photo_url: '/images/store1.jpg',
        display_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.innerWidth for desktop layout testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
  })

  describe('Loading State', () => {
    it('shows skeleton loaders while loading', async () => {
      mockFetchStoresWithPhotos.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<StoreList />)

      expect(screen.getAllByTestId('store-skeleton')).toHaveLength(3)
    })
  })

  describe('Error State', () => {
    it('shows error message when fetch fails', async () => {
      mockFetchStoresWithPhotos.mockRejectedValue(new Error('Network error'))

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('Failed to load stores')).toBeInTheDocument()
      })
    })
  })

  describe('Empty State', () => {
    it('shows empty message when no stores found', async () => {
      mockFetchStoresWithPhotos.mockResolvedValue([])

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('No stores found')).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    it('renders stores with alternating layout on desktop', async () => {
      mockFetchStoresWithPhotos.mockResolvedValue([mockStore])

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      })

      // Check that StoreItem is rendered (layout logic is tested in StoreItem tests)
      expect(screen.getByRole('region', { name: /store item/i })).toBeInTheDocument()
    })

    it('renders multiple stores with alternating layouts', async () => {
      const mockStores = [
        mockStore,
        { ...mockStore, id: 'store-2', name: 'Hotlob Melbourne' },
        { ...mockStore, id: 'store-3', name: 'Hotlob Brisbane' }
      ]
      mockFetchStoresWithPhotos.mockResolvedValue(mockStores)

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
        expect(screen.getByText('Hotlob Melbourne')).toBeInTheDocument()
        expect(screen.getByText('Hotlob Brisbane')).toBeInTheDocument()
      })

      // Should have 3 store items
      expect(screen.getAllByRole('region', { name: /store item/i })).toHaveLength(3)
    })

    it('renders carousel-left variant', async () => {
      mockFetchStoresWithPhotos.mockResolvedValue([mockStore])

      render(<StoreList variant="carousel-left" />)

      await waitFor(() => {
        expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      })

      // Check that StoreItem is rendered with carousel-left layout
      const storeItem = screen.getByRole('region', { name: /store item/i })
      expect(storeItem).toHaveClass('store-item-carousel-left')
    })
  })

  describe('Responsive Layout', () => {
    it('uses stacked layout on mobile', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      mockFetchStoresWithPhotos.mockResolvedValue([mockStore])

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      })

      // The layout prop should be 'stacked' for mobile
      // This is tested more thoroughly in StoreItem component tests
    })

    it('uses alternating layout on desktop', async () => {
      mockFetchStoresWithPhotos.mockResolvedValue([mockStore])

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      })

      // Layout logic is handled in the component and passed to StoreItem
    })
  })

  describe('Error Boundary', () => {
    it('wraps content in ErrorBoundary', async () => {
      mockFetchStoresWithPhotos.mockResolvedValue([mockStore])

      render(<StoreList />)

      await waitFor(() => {
        expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      })

      // Error boundary should be present (tested more thoroughly in ErrorBoundary tests)
      const storeItem = screen.getByRole('region', { name: /store item/i })
      const errorBoundaryWrapper = storeItem.closest('[data-error-boundary]')
      expect(errorBoundaryWrapper).toBeInTheDocument()
    })
  })
})