import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MoreButton } from '../../../../components/buttons/MoreButton'

describe('MoreButton', () => {
  it('renders with correct label text', () => {
    render(<MoreButton href="/menu" />)
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('renders as a link with correct href', () => {
    render(<MoreButton href="/see-our-food" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/see-our-food')
  })

  it('renders a circular wrapper for the icon', () => {
    const { container } = render(<MoreButton href="/menu" />)
    const circle = container.querySelector('.more-button__circle')
    expect(circle).toBeInTheDocument()
  })

  it('renders an arrow div inside the circle with background image', () => {
    const { container } = render(<MoreButton href="/menu" />)
    const arrow = container.querySelector('.more-button__arrow')
    expect(arrow).toBeInTheDocument()
    expect(arrow?.tagName).toBe('DIV')
    expect(arrow).toHaveClass('more-button__arrow')
  })

  it('applies responsive classes for styling', () => {
    render(<MoreButton href="/menu" />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('more-button')
  })

  it('applies label and circle styling classes', () => {
    const { container } = render(<MoreButton href="/menu" />)
    const label = container.querySelector('.more-button__label')
    const circle = container.querySelector('.more-button__circle')
    expect(label).toHaveClass('more-button__label')
    expect(circle).toHaveClass('more-button__circle')
  })
})
