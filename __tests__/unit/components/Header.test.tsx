import type { ReactNode } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from '../../../components/Header'

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

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />)

    expect(screen.getByAltText(/hotlob logo/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /see our food/i })).toHaveAttribute('href', '/see-our-food')
    expect(screen.getByRole('link', { name: /catering/i })).toHaveAttribute('href', '/catering')
    expect(screen.getByRole('link', { name: /our locations/i })).toHaveAttribute('href', '/locations')
    expect(screen.getByRole('link', { name: /hotlob news/i })).toHaveAttribute('href', '/hotlob-news')
  })

  it('renders social icons and CTA button', () => {
    render(<Header />)

    expect(screen.getByLabelText(/hotlob on facebook/i)).toHaveAttribute('href', 'https://www.facebook.com/hotlob/')
    expect(screen.getByLabelText(/hotlob on instagram/i)).toHaveAttribute('href', 'https://www.instagram.com/hotlobaustralia/')
    expect(screen.getByRole('button', { name: /order online/i })).toBeInTheDocument()
  })

  it('opens social icons in new tabs', () => {
    render(<Header />)

    const facebookLink = screen.getByLabelText(/hotlob on facebook/i)
    const instagramLink = screen.getByLabelText(/hotlob on instagram/i)

    expect(facebookLink).toHaveAttribute('target', '_blank')
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      // Reset document.body.style.overflow before each test
      document.body.style.overflow = ''
    })

    it('renders hamburger menu button', () => {
      render(<Header />)
      
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      expect(hamburger).toBeInTheDocument()
      expect(hamburger).toHaveAttribute('aria-expanded', 'false')
    })

    it('toggles mobile menu when hamburger is clicked', () => {
      render(<Header />)
      
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      
      // Menu should be closed initially
      expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      
      // Open menu
      fireEvent.click(hamburger)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close navigation menu/i })).toHaveAttribute('aria-expanded', 'true')
    })

    it('displays navigation links in mobile overlay', () => {
      render(<Header />)
      
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      fireEvent.click(hamburger)
      
      const overlay = screen.getByRole('dialog')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveAttribute('aria-modal', 'true')
      
      // Check that overlay contains navigation links
      const overlayNav = overlay.querySelector('nav')
      expect(overlayNav).toBeInTheDocument()
    })

    it('closes mobile menu when navigation link is clicked', () => {
      render(<Header />)
      
      // Open menu
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      fireEvent.click(hamburger)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Click a navigation link in the overlay
      const overlay = screen.getByRole('dialog')
      const navLink = overlay.querySelector('a[href="/see-our-food"]')
      expect(navLink).toBeInTheDocument()
      
      if (navLink) {
        fireEvent.click(navLink)
      }
      
      // Menu should be closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes mobile menu when overlay background is clicked', () => {
      render(<Header />)
      
      // Open menu
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      fireEvent.click(hamburger)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Click overlay background
      const overlay = screen.getByRole('dialog')
      fireEvent.click(overlay)
      
      // Menu should be closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes mobile menu when Escape key is pressed', () => {
      render(<Header />)
      
      // Open menu
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      fireEvent.click(hamburger)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Press Escape key
      fireEvent.keyDown(window, { key: 'Escape' })
      
      // Menu should be closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('locks body scroll when menu is open', () => {
      render(<Header />)
      
      expect(document.body.style.overflow).toBe('')
      
      // Open menu
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      fireEvent.click(hamburger)
      
      // Body overflow should be hidden
      expect(document.body.style.overflow).toBe('hidden')
      
      // Close menu
      fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }))
      
      // Body overflow should be restored
      expect(document.body.style.overflow).toBe('')
    })

    it('has correct ARIA attributes on hamburger icon', () => {
      render(<Header />)
      
      const hamburger = screen.getByRole('button', { name: /open navigation menu/i })
      expect(hamburger).toHaveAttribute('role', 'button')
      expect(hamburger).toHaveAttribute('aria-expanded', 'false')
      expect(hamburger).toHaveAttribute('aria-label', 'Open navigation menu')
      
      // Open menu and check attributes update
      fireEvent.click(hamburger)
      const closeButton = screen.getByRole('button', { name: /close navigation menu/i })
      expect(closeButton).toHaveAttribute('aria-expanded', 'true')
      expect(closeButton).toHaveAttribute('aria-label', 'Close navigation menu')
    })
  })
})
