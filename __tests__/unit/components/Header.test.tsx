import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
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
})
