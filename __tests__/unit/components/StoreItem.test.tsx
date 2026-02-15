import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StoreItem from '../../../components/StoreItem'
import type { Store, StorePhoto } from '../../../types/store'

describe('StoreItem', () => {
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
        'Monday: 9:00 AM – 5:00 PM',     // index 0
        'Tuesday: 9:00 AM – 5:00 PM',    // index 1
        'Wednesday: 9:00 AM – 5:00 PM',  // index 2
        'Thursday: 9:00 AM – 5:00 PM',   // index 3
        'Friday: 9:00 AM – 5:00 PM',     // index 4
        'Saturday: 10:00 AM – 6:00 PM',  // index 5
        'Sunday: 10:00 AM – 6:00 PM'     // index 6
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

  describe('Layout Variants', () => {
    it('renders stacked layout correctly', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      const item = screen.getByTestId('store-item')
      expect(item).toHaveClass('store-item-stacked')
      expect(item).toHaveAttribute('role', 'region')
      expect(item).toHaveAttribute('aria-label', 'Store item')
    })

    it('renders alternating layout correctly', () => {
      render(<StoreItem store={mockStore} layout="left" />)

      const item = screen.getByTestId('store-item')
      expect(item).toHaveClass('store-item-alternating')
    })

    it('positions map on left for left layout', () => {
      render(<StoreItem store={mockStore} layout="left" />)

      const item = screen.getByTestId('store-item')
      const children = item.children

      // First child should be the map (GoogleMapEmbed)
      expect(children[0]).toHaveAttribute('data-testid', 'google-map-embed')
      // Second child should be the info (StoreInfo)
      expect(children[1]).toHaveAttribute('data-testid', 'store-info')
    })

    it('positions info on left for right layout', () => {
      render(<StoreItem store={mockStore} layout="right" />)

      const item = screen.getByTestId('store-item')
      const children = item.children

      // First child should be the info (StoreInfo)
      expect(children[0]).toHaveAttribute('data-testid', 'store-info')
      // Second child should be the map (GoogleMapEmbed)
      expect(children[1]).toHaveAttribute('data-testid', 'google-map-embed')
    })
  })

  describe('Store Data Display', () => {
    it('displays store name', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      expect(screen.getByText('Hotlob Sydney')).toBeInTheDocument()
    })

    it('displays formatted address', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      expect(screen.getByText('123 Main St, Sydney, NSW, 2000')).toBeInTheDocument()
    })

    it('shows operating status as Open when store is open', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      expect(screen.getByText('Open')).toBeInTheDocument()
    })

    it('shows operating status as Closed when store is closed', () => {
      const closedStore = {
        ...mockStore,
        google_trading_hours: {
          ...mockStore.google_trading_hours,
          open_now: false
        }
      }

      render(<StoreItem store={closedStore} layout="stacked" />)

      expect(screen.getByText('Closed')).toBeInTheDocument()
    })

    it('displays todays hours', () => {
      // Mock Date to be Monday (getDay() returns 1)
      const mockDate = new Date('2024-01-01T12:00:00Z') // Monday
      vi.setSystemTime(mockDate)

      render(<StoreItem store={mockStore} layout="stacked" />)

      // For Monday (getDay() = 1), we should get Monday's hours
      expect(screen.getByText('Monday: 9:00 AM – 5:00 PM')).toBeInTheDocument()

      vi.useRealTimers()
    })

    it('displays rating when available', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      expect(screen.getByText('4.5')).toBeInTheDocument()
    })
  })

  describe('Map Integration', () => {
    it('renders map when embed URL is available', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      expect(screen.getByTestId('google-map-embed')).toBeInTheDocument()
    })

    it('does not render map when embed URL is missing', () => {
      const storeWithoutMap = {
        ...mockStore,
        google_maps_embed_url: null
      }

      render(<StoreItem store={storeWithoutMap} layout="stacked" />)

      expect(screen.queryByTestId('google-map-embed')).not.toBeInTheDocument()
    })
  })

  describe('Photo Display', () => {
    it('passes photos to StoreInfo component', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      // Photos are handled by StoreInfo component
      const storeInfo = screen.getByTestId('store-info')
      expect(storeInfo).toBeInTheDocument()
    })

    it('handles stores without photos', () => {
      const storeWithoutPhotos = {
        ...mockStore,
        photos: undefined
      }

      render(<StoreItem store={storeWithoutPhotos} layout="stacked" />)

      expect(screen.getByTestId('store-info')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      const item = screen.getByTestId('store-item')
      expect(item).toHaveAttribute('role', 'region')
      expect(item).toHaveAttribute('aria-label', 'Store item')
    })

    it('maintains semantic structure', () => {
      render(<StoreItem store={mockStore} layout="stacked" />)

      expect(screen.getByRole('region', { name: 'Store item' })).toBeInTheDocument()
    })
  })
})