import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExpandableCardGrid } from '@/components/cards/ExpandableCardGrid'

const mockCards = [
  {
    title: 'Card 1',
    description: 'Description for card 1',
  },
  {
    title: 'Card 2',
    description: 'Description for card 2',
  },
  {
    title: 'Card 3',
    description: 'Description for card 3',
  },
]

describe('ExpandableCardGrid', () => {
  it('renders all three cards with titles', () => {
    render(<ExpandableCardGrid items={mockCards} />)

    expect(screen.getByText('Card 1')).toBeInTheDocument()
    expect(screen.getByText('Card 2')).toBeInTheDocument()
    expect(screen.getByText('Card 3')).toBeInTheDocument()
  })

  it('renders all descriptions in the DOM (CSS controls visibility on desktop)', () => {
    render(<ExpandableCardGrid items={mockCards} />)

    // All descriptions are rendered to the DOM (visible on mobile, hidden on desktop for inactive)
    expect(screen.getByText('Description for card 1')).toBeInTheDocument()
    expect(screen.getByText('Description for card 2')).toBeInTheDocument()
    expect(screen.getByText('Description for card 3')).toBeInTheDocument()
  })

  it('renders a root container with the correct className', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const gridRoot = container.querySelector('.ExpandableCardGrid-root')
    expect(gridRoot).toBeInTheDocument()
  })

  it('renders a container div with the correct className', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const gridContainer = container.querySelector('.ExpandableCardGrid-container')
    expect(gridContainer).toBeInTheDocument()
  })

  it('renders three card elements', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')
    expect(cards).toHaveLength(3)
  })

  it('applies active state to the first card by default', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')
    expect(cards[0]).toHaveClass('ExpandableCardGrid-card--active')
  })

  it('changes active state on mouse enter for desktop', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')

    // Initially, first card is active
    expect(cards[0]).toHaveClass('ExpandableCardGrid-card--active')
    expect(cards[1]).not.toHaveClass('ExpandableCardGrid-card--active')

    // Hover over second card
    fireEvent.mouseEnter(cards[1])

    // Second card should now be active
    expect(cards[1]).toHaveClass('ExpandableCardGrid-card--active')
    expect(cards[0]).not.toHaveClass('ExpandableCardGrid-card--active')
  })

  it('applies active class correctly when hovering over different cards', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')

    // Initially, first card is active (has --active class)
    expect(cards[0]).toHaveClass('ExpandableCardGrid-card--active')
    expect(cards[1]).not.toHaveClass('ExpandableCardGrid-card--active')

    // Hover over second card
    fireEvent.mouseEnter(cards[1])

    // Second card should now have --active class
    expect(cards[1]).toHaveClass('ExpandableCardGrid-card--active')
    expect(cards[0]).not.toHaveClass('ExpandableCardGrid-card--active')

    // All descriptions still exist in DOM (CSS controls visibility on desktop)
    expect(screen.getByText('Description for card 1')).toBeInTheDocument()
    expect(screen.getByText('Description for card 2')).toBeInTheDocument()
  })

  it('sets background image custom properties on cards', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')

    // Check that cards have background image custom properties set
    const firstCard = cards[0] as HTMLElement
    const mobileStyle = firstCard.style.getPropertyValue('--mobile-bg')
    const desktopStyle = firstCard.style.getPropertyValue('--desktop-bg')
    
    expect(mobileStyle).toContain('card1-active-mb.png')
    expect(desktopStyle).toContain('card1-active.png') // Active by default
  })

  it('handles empty card items gracefully', () => {
    const { container } = render(<ExpandableCardGrid items={[]} />)
    const gridContainer = container.querySelector('.ExpandableCardGrid-container')
    expect(gridContainer).toBeInTheDocument()
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')
    expect(cards).toHaveLength(0)
  })

  it('renders card titles with heading level 3', () => {
    render(<ExpandableCardGrid items={mockCards} />)

    const titles = screen.getAllByRole('heading', { level: 3 })
    expect(titles.length).toBeGreaterThanOrEqual(3)

    // Verify the titles match our mock data
    expect(titles[0]).toHaveTextContent('Card 1')
    expect(titles[1]).toHaveTextContent('Card 2')
    expect(titles[2]).toHaveTextContent('Card 3')
  })

  it('renders content div with correct className for each card', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const contentDivs = container.querySelectorAll('.ExpandableCardGrid-content')
    expect(contentDivs).toHaveLength(3)
  })

  it('multiple cards can change active state sequentially', () => {
    const { container } = render(<ExpandableCardGrid items={mockCards} />)
    const cards = container.querySelectorAll('.ExpandableCardGrid-card')

    // Hover over third card
    fireEvent.mouseEnter(cards[2])
    expect(cards[2]).toHaveClass('ExpandableCardGrid-card--active')
    expect(screen.getByText('Description for card 3')).toBeInTheDocument()

    // Hover back to first card
    fireEvent.mouseEnter(cards[0])
    expect(cards[0]).toHaveClass('ExpandableCardGrid-card--active')
    expect(screen.getByText('Description for card 1')).toBeInTheDocument()
  })
})

