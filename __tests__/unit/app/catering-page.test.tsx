import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CateringPage from '@/app/catering/page';

vi.mock('@/lib/store', () => ({
  fetchStores: vi.fn().mockResolvedValue([]),
}));

describe('CateringPage', () => {
  it('renders the top section text and bottom headings', () => {
    render(<CateringPage />);

    expect(screen.getByText('The ULTIMATE Catering Pack!')).toBeInTheDocument();
    expect(screen.getByText('Leave as what you have')).toBeInTheDocument();
    expect(
      screen.getByText('MIX 16 ROLL SET PAX 4-6')
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('heading', { name: 'ORDER NOW' }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(
        'Please note that orders need to be placed 48 hours (business days) ahead of pick up day.'
      )
    ).toBeInTheDocument();
  });

  it('renders the catering form fields', () => {
    render(<CateringPage />);

    expect(screen.getByLabelText('Select a store')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Catering date')).toBeInTheDocument();
    expect(screen.getByLabelText('Pick up time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SUBMIT' })).toBeInTheDocument();
  });
});
