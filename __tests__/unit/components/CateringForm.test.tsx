import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CateringForm, buildTimeOptions } from '@/components/CateringForm';
import type { Store } from '@/types/store';

vi.mock('@/lib/store', () => ({
  fetchStores: vi.fn().mockResolvedValue([]),
}));

const baseStore: Store = {
  id: 'store-1',
  name: 'Hotlob Test',
  street: null,
  suburb: null,
  state: null,
  postcode: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  latitude: null,
  longitude: null,
  google_place_id: null,
  google_maps_embed_url: null,
  uber_url: '',
  email: 'test@example.com',
  google_url: '',
  google_rating: null,
  google_user_ratings_total: null,
  google_trading_hours: null,
  google_last_synced_at: null,
};

describe('CateringForm time options', () => {
  it('builds time options from store trading hours', () => {
    const store: Store = {
      ...baseStore,
      google_trading_hours: {
        periods: [
          {
            open: { day: 1, hour: 9, minute: 0 },
            close: { day: 1, hour: 17, minute: 0 },
          },
        ],
      },
    };
    const date = new Date('2024-01-08T00:00:00');
    const options = buildTimeOptions(store, date);

    expect(options[0]).toBe('9:00');
    expect(options[options.length - 1]).toBe('16:30');
  });

  it('falls back to default hours when trading hours are missing', () => {
    const date = new Date('2024-01-08T00:00:00');
    const options = buildTimeOptions(baseStore, date);

    expect(options[0]).toBe('10:00');
    expect(options[options.length - 1]).toBe('16:30');
  });
});

describe('CateringForm behavior', () => {
  it('disables the pickup time select before a store is chosen', () => {
    render(<CateringForm />);
    expect(screen.getByLabelText('Pick up time')).toBeDisabled();
  });
});
