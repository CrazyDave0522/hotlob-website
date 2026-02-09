import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { DishCard } from '../../../components/DishCard'
import type { AllergenTag, Dish, MediaAsset } from '../../../types/dish'

describe('DishCard', () => {
  const dish: Dish = {
    id: 'dish-1',
    name: 'Lobster Roll',
    description: 'Buttery brioche with premium lobster.',
    tier: 'premium',
    is_visible: true,
    is_available: true
  }

  const image: MediaAsset = {
    id: 'image-1',
    dish_id: 'dish-1',
    image_url: '/images/dish.jpg',
    position: 1
  }

  const allergens: AllergenTag[] = [
    {
      id: 'allergen-1',
      name: 'Shellfish',
      icon_url: '/icons/shellfish.svg'
    }
  ]

  it('renders all primary content elements', () => {
    render(<DishCard dish={dish} image={image} allergens={allergens} expanded={false} />)

    expect(screen.getByRole('heading', { name: /lobster roll/i })).toBeInTheDocument()
    expect(screen.getByText(/buttery brioche/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /order now/i })).toBeInTheDocument()
    expect(screen.getByAltText(/shellfish/i)).toBeInTheDocument()
  })

  it('applies expanded class when expanded', () => {
    const { container } = render(
      <DishCard dish={dish} image={image} allergens={allergens} expanded={true} />
    )

    expect(container.querySelector('.DishCard')).toHaveClass('DishCard--expanded')
  })
})
