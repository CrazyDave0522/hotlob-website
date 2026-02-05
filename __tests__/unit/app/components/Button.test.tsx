import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../../../../components/Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button', { name: /primary/i })
    expect(button).toHaveClass('bg-blue-600')
  })

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button', { name: /secondary/i })
    expect(button).toHaveClass('bg-gray-200')
  })

  it('is disabled when disabled prop is true', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)

    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})