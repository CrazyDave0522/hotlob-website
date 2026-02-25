import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Hero from '@/components/layout/Hero'
import StoreList from '@/components/store/StoreList'

// Mock the store fetching function
vi.mock('@/lib/store', () => ({
  fetchStoresWithPhotos: vi.fn().mockResolvedValue([
    {
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
      google_rating: 4.7,
      google_user_ratings_total: 62,
      google_trading_hours: {
        open_now: true,
        weekday_text: [
          'Monday: 9:00 AM – 5:00 PM',
          'Tuesday: 9:00 AM – 5:00 PM',
          'Wednesday: 9:00 AM – 5:00 PM',
          'Thursday: 9:00 AM – 5:00 PM',
          'Friday: 9:00 AM – 5:00 PM',
          'Saturday: 9:00 AM – 5:00 PM',
          'Sunday: 9:00 AM – 5:00 PM'
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
  ])
}))

describe('Locations Page Integration', () => {
  it('renders the complete locations page layout', async () => {
    render(
      <main>
        <Hero
          variant="short"
          bgImage="/images/hero-bg/our-locations-hero.png"
          title="Find Hotlob near you"
          subtitle={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.\nGrab one on your lunch break, between uni lectures, or on your way home.`}
          overlay={true}
        />
        <StoreList />
      </main>
    )

    // Check that Hero component is rendered with correct props
    expect(screen.getByText('Find Hotlob near you')).toBeInTheDocument()

    // Check that StoreList component is rendered
    expect(await screen.findByText('Hotlob Sydney')).toBeInTheDocument()

    // Check that embedded map is displayed
    const mapIframe = screen.getByTitle('Store location map')
    expect(mapIframe).toBeInTheDocument()
    expect(mapIframe.tagName).toBe('IFRAME')

    // Check that rating is displayed
    expect(screen.getByText('4.7')).toBeInTheDocument()

    // Check that operating status is displayed
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('has proper page structure', () => {
    render(
      <main>
        <Hero
          variant="short"
          bgImage="/images/hero-bg/our-locations-hero.png"
          title="Find Hotlob near you"
          subtitle={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.\nGrab one on your lunch break, between uni lectures, or on your way home.`}
          overlay={true}
        />
        <StoreList />
      </main>
    )

    // Check semantic HTML structure
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()

    // Hero and StoreList should be direct children of main
    expect(main.children).toHaveLength(2)
  })

  it('displays hero with locations-specific content', () => {
    render(
      <Hero
        variant="short"
        bgImage="/images/hero-bg/our-locations-hero.png"
        title="Find Hotlob near you"
        subtitle={`We're serving up the rolls everyone's talking about — now in Perth and Melbourne.\nGrab one on your lunch break, between uni lectures, or on your way home.`}
        overlay={true}
      />
    )

    expect(screen.getByText('Find Hotlob near you')).toBeInTheDocument()
  })

  it('integrates StoreList component properly', async () => {
    render(<StoreList />)

    // Wait for the async data loading to complete
    expect(await screen.findByText('Hotlob Sydney')).toBeInTheDocument()
  })
})