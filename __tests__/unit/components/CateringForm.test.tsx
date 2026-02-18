import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CateringForm, buildTimeOptions } from '@/components/CateringForm';
import type { Store } from '@/types/store';

const fetchStoresMock = vi.fn();

vi.mock('@/lib/store', () => ({
  fetchStores: fetchStoresMock,
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
  beforeEach(() => {
    fetchStoresMock.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('disables the pickup time select before a store is chosen', () => {
    render(<CateringForm />);
    expect(screen.getByLabelText('Pick up time')).toBeDisabled();
  });

  it('shows a success toast after submission', async () => {
    fetchStoresMock.mockResolvedValue([baseStore]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    const user = userEvent.setup();

    render(<CateringForm />);

    await screen.findByRole('option', { name: 'Pick up @Hotlob Test' });

    await user.selectOptions(
      screen.getByLabelText('Select a store'),
      'store-1'
    );
    await user.type(screen.getByLabelText('First name'), 'Jane');
    await user.type(screen.getByLabelText('Last name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Phone'), '0412 345 678');

    await user.selectOptions(
      screen.getByLabelText('Pick up time'),
      '10:00'
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Order submitted')).toBeInTheDocument();
    });
  });

  it('shows an error toast when submission fails', async () => {
    fetchStoresMock.mockResolvedValue([baseStore]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const user = userEvent.setup();

    render(<CateringForm />);

    await screen.findByRole('option', { name: 'Pick up @Hotlob Test' });

    await user.selectOptions(
      screen.getByLabelText('Select a store'),
      'store-1'
    );
    await user.type(screen.getByLabelText('First name'), 'Jane');
    await user.type(screen.getByLabelText('Last name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Phone'), '0412 345 678');

    await user.selectOptions(
      screen.getByLabelText('Pick up time'),
      '10:00'
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Submission failed')).toBeInTheDocument();
    });
  });
});
