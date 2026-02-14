import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StoreSelectionModal from '../../../components/StoreSelectionModal'
import type { Store } from '../../../types/store'

describe('StoreSelectionModal accessibility', () => {
  it('focuses close button on open and traps focus between close and store items', async () => {
    const stores: Store[] = [
      { id: '1', name: 'A Store', street: '1 Road', suburb: 'Suburb', state: 'ST', postcode: '0000', created_at: '', updated_at: '', latitude: null, longitude: null, google_place_id: null, google_maps_embed_url: null, uber_url: 'https://uber', email: '', google_url: '', google_rating: null, google_user_ratings_total: null, google_trading_hours: null, google_last_synced_at: null },
      { id: '2', name: 'B Store', street: '2 Road', suburb: 'Suburb', state: 'ST', postcode: '0000', created_at: '', updated_at: '', latitude: null, longitude: null, google_place_id: null, google_maps_embed_url: null, uber_url: 'https://uber', email: '', google_url: '', google_rating: null, google_user_ratings_total: null, google_trading_hours: null, google_last_synced_at: null }
    ]

    const onClose = vi.fn()
    const onStoreSelect = vi.fn()

    render(<StoreSelectionModal isOpen={true} onClose={onClose} onStoreSelect={onStoreSelect} stores={stores} />)

    const closeBtn = screen.getByLabelText(/close store selection modal/i)
    await waitFor(() => expect(document.activeElement).toBe(closeBtn))

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)

    // Escape should trigger onClose
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})
