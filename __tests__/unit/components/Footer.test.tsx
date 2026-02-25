import type { ReactNode } from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Footer } from '../../../components/layout/Footer'

// Mock the store fetching and geolocation utilities
vi.mock('@/lib/store', () => ({
  fetchStores: vi.fn().mockReturnValue([
    {
      id: '1',
      name: 'Test Store',
      email: 'test@example.com',
      latitude: -33.8688,
      longitude: 151.2093,
      street: '123 Test St',
      suburb: 'Test Suburb',
      state: 'NSW',
      postcode: '2000'
    }
  ])
}))

vi.mock('@/utils/geolocation', () => ({
  tryGetQuickLocation: vi.fn().mockReturnValue({
    lat: -33.8688,
    lon: 151.2093
  })
}))

vi.mock('@/utils/distance', () => ({
  calculateDistance: vi.fn().mockReturnValue(5.2)
}))

vi.mock('../../../components/store/StoreSelectionModal', () => ({
  StoreSelectionModal: ({ isOpen }: { isOpen: boolean }) => 
    isOpen ? <div data-testid="store-modal">Store Modal</div> : null
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}))

describe('Footer', () => {
  it('renders legal links with correct destinations and behavior', async () => {
    await act(() => render(<Footer />))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(screen.getByAltText(/hotlob logo/i)).toBeInTheDocument()

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
    const termsLink = screen.getByRole('link', { name: /terms & conditions/i })
    const contactLink = screen.getByRole('link', { name: /contact us/i })

    expect(privacyLink).toHaveAttribute('href', '/privacy-policy')
    expect(privacyLink).toHaveAttribute('target', '_blank')
    expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer')

    expect(termsLink).toHaveAttribute('href', '/terms-and-conditions')
    expect(termsLink).toHaveAttribute('target', '_blank')
    expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer')

    expect(contactLink).toHaveAttribute('href', '#')

    // Test Contact Us functionality
    await act(() => fireEvent.click(contactLink))
    
    await waitFor(() => {
      expect(screen.getByTestId('store-modal')).toBeInTheDocument()
    })
  })

  it('renders copyright notice and social icons', () => {
    render(<Footer />)

    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()

    expect(screen.getByLabelText(/hotlob on facebook/i)).toHaveAttribute('href', 'https://www.facebook.com/hotlob/')
    expect(screen.getByLabelText(/hotlob on instagram/i)).toHaveAttribute('href', 'https://www.instagram.com/hotlobaustralia/')
  })

  it('opens social icons in new tabs', () => {
    render(<Footer />)

    const facebookLink = screen.getByLabelText(/hotlob on facebook/i)
    const instagramLink = screen.getByLabelText(/hotlob on instagram/i)

    expect(facebookLink).toHaveAttribute('target', '_blank')
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
