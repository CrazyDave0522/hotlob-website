import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StoreSelectionModal from '../../../components/StoreSelectionModal'
import type { Store } from '../../../types/store'

describe('StoreSelectionModal', () => {
  const stores: Store[] = [
    { id: '1', name: 'A Store', street: '1 Road', suburb: 'Suburb', state: 'ST', postcode: '0000', created_at: '', updated_at: '', latitude: null, longitude: null, google_place_id: null, google_maps_embed_url: null, uber_url: 'https://uber', email: '', google_url: '', google_rating: null, google_user_ratings_total: null, google_trading_hours: null, google_last_synced_at: null }
  ]

  it('renders when open and displays stores', () => {
    render(<StoreSelectionModal isOpen={true} onClose={() => {}} onStoreSelect={() => {}} stores={stores} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/select a store/i)).toBeInTheDocument()
    const list = screen.getByRole('list')
    const item = within(list).getByRole('listitem')
    expect(within(item).getByText(/a store/i)).toBeInTheDocument()
  })

  it('calls onStoreSelect when store clicked', () => {
    const onStoreSelect = vi.fn()
    render(<StoreSelectionModal isOpen={true} onClose={() => {}} onStoreSelect={onStoreSelect} stores={stores} />)

    const list = screen.getByRole('list')
    const item = within(list).getByRole('listitem')
    fireEvent.click(item)

    expect(onStoreSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<StoreSelectionModal isOpen={true} onClose={onClose} onStoreSelect={() => {}} stores={stores} />)

    const btn = screen.getByLabelText(/close store selection modal/i)
    fireEvent.click(btn)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
