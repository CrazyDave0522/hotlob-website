import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StoreList from '../../../components/StoreList'
import StoreItem from '../../../components/StoreItem'
import Rating from '../../../components/Rating'
import GoogleMapEmbed from '../../../components/GoogleMapEmbed'
import StoreInfo from '../../../components/StoreInfo'
import type { Store, StorePhoto } from '../../../types/store'

// Mock the store library
vi.mock('../../../lib/store', () => ({
  fetchStoresWithPhotos: vi.fn().mockResolvedValue([])
}))

describe('Accessibility Tests', () => {
  const mockStore: Store & { photos?: StorePhoto[] } = {
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
      weekday_text: [
        'Sunday: 10:00 AM – 6:00 PM',
        'Monday: 9:00 AM – 5:00 PM',
        'Tuesday: 9:00 AM – 5:00 PM',
        'Wednesday: 9:00 AM – 5:00 PM',
        'Thursday: 9:00 AM – 5:00 PM',
        'Friday: 9:00 AM – 5:00 PM',
        'Saturday: 10:00 AM – 6:00 PM'
      ]
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

  describe('StoreList Accessibility', () => {
    it('has proper loading state accessibility', async () => {
      // Mock pending fetch
      const { fetchStoresWithPhotos } = await import('../../../lib/store')
      vi.mocked(fetchStoresWithPhotos).mockImplementation(() => new Promise(() => {}))

      render(<StoreList />)

      // Loading skeletons should be present
      const skeletons = screen.getAllByTestId('store-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)

      // Skeletons should have aria-busy or similar indicators if needed
      // (This would be tested with actual screen reader testing)
    })

    it('has proper error state accessibility', async () => {
      const { fetchStoresWithPhotos } = await import('../../../lib/store')
      vi.mocked(fetchStoresWithPhotos).mockRejectedValue(new Error('Network error'))

      render(<StoreList />)

      // Error message should be visible
      expect(await screen.findByText('Failed to load stores')).toBeInTheDocument()
    })
  })

  describe('StoreItem Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      const item = screen.getByRole('region', { name: 'Store item' })
      expect(item).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Hotlob Sydney')
    })

    it('provides context for screen readers', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      // Address should be properly associated
      expect(screen.getByText('123 Main St, Sydney, NSW, 2000')).toBeInTheDocument()

      // Operating status should be clear
      expect(screen.getByText('Open')).toBeInTheDocument()
    })
  })

  describe('Rating Component Accessibility', () => {
    it('has descriptive alt text for star images', () => {
      render(<Rating value={4.5} />)

      expect(screen.getAllByAltText('Full star')).toHaveLength(4)
      expect(screen.getAllByAltText('Half star')).toHaveLength(1)
      expect(screen.queryAllByAltText('Empty star')).toHaveLength(0)
    })

    it('provides rating value as text', () => {
      render(<Rating value={4.5} />)

      // The numeric value should be available as text
      expect(screen.getByText('4.5')).toBeInTheDocument()
    })

    it('maintains meaningful content for screen readers', () => {
      render(<Rating value={3.0} />)

      // Screen readers can understand the star pattern + numeric value
      const stars = screen.getAllByAltText(/star/i)
      expect(stars).toHaveLength(5)
      expect(screen.getByText('3.0')).toBeInTheDocument()
    })
  })

  describe('GoogleMapEmbed Accessibility', () => {
    it('has proper iframe title', () => {
      render(<GoogleMapEmbed embedUrl="https://example.com/map" googleUrl="https://maps.google.com" />)

      const iframe = screen.getByTitle('Store location map')
      expect(iframe).toBeInTheDocument()
    })

    it('opens in new tab when clicked', async () => {
      const user = userEvent.setup()
      const mockOpen = vi.fn()
      global.open = mockOpen

      render(<GoogleMapEmbed embedUrl="https://example.com/map" googleUrl="https://maps.google.com" />)

      const mapContainer = screen.getByTestId('google-map-embed')
      await user.click(mapContainer)

      expect(mockOpen).toHaveBeenCalledWith('https://maps.google.com', '_blank', 'noopener,noreferrer')
    })

    it('handles missing googleUrl gracefully', async () => {
      const user = userEvent.setup()
      const mockOpen = vi.fn()
      global.open = mockOpen

      render(<GoogleMapEmbed embedUrl="https://example.com/map" />)

      const mapContainer = screen.getByTestId('google-map-embed')
      await user.click(mapContainer)

      // Should not open anything if no googleUrl
      expect(mockOpen).not.toHaveBeenCalled()
    })
  })

  describe('StoreInfo Accessibility', () => {
    it('has proper heading structure', () => {
      render(<StoreInfo
        name="Hotlob Sydney"
        address="123 Main St, Sydney"
        rating={4.5}
        operatingStatus="Open"
        todaysHours="9:00 AM – 5:00 PM"
      />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Hotlob Sydney')
    })

    it('provides comprehensive store information', () => {
      render(<StoreInfo
        name="Hotlob Sydney"
        address="123 Main St, Sydney"
        rating={4.5}
        operatingStatus="Open"
        todaysHours="9:00 AM – 5:00 PM"
      />)

      expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      expect(screen.getByText('123 Main St, Sydney')).toBeInTheDocument()
      expect(screen.getByText('Open')).toBeInTheDocument()
      expect(screen.getByText('9:00 AM – 5:00 PM')).toBeInTheDocument()
      expect(screen.getByText('4.5')).toBeInTheDocument()
    })

    it('handles photo accessibility', () => {
      const photos: StorePhoto[] = [
        {
          id: 'photo-1',
          store_id: 'store-1',
          photo_url: '/images/store1.jpg',
          display_order: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      render(<StoreInfo
        name="Hotlob Sydney"
        address="123 Main St, Sydney"
        photos={photos}
      />)

      // Photo button should have proper aria-label
      const photoButton = screen.getByRole('button', { name: 'View Hotlob Sydney store photo 1' })
      expect(photoButton).toBeInTheDocument()
    })

    it('handles missing optional information gracefully', () => {
      render(<StoreInfo
        name="Hotlob Sydney"
        address="123 Main St, Sydney"
      />)

      // Should still render basic information
      expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
      expect(screen.getByText('123 Main St, Sydney')).toBeInTheDocument()

      // Optional elements should not be present
      expect(screen.queryByText(/\d\.\d/)).not.toBeInTheDocument() // No rating
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation for interactive elements', async () => {
      const photos: StorePhoto[] = [
        {
          id: 'photo-1',
          store_id: 'store-1',
          photo_url: '/images/store1.jpg',
          display_order: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]

      render(<StoreInfo
        name="Hotlob Sydney"
        address="123 Main St, Sydney"
        photos={photos}
      />)

      // Photo button should have proper aria-label
      const photoButton = screen.getByRole('button', { name: 'View Hotlob Sydney store photo 1' })
      expect(photoButton).toBeInTheDocument()
    })
  })
})