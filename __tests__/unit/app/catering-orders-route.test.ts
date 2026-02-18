import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/catering-orders/route';

const sendEmailMock = vi.fn().mockResolvedValue(undefined);

const insertSingleMock = vi.fn();
const insertSelectMock = vi.fn(() => ({ single: insertSingleMock }));
const insertMock = vi.fn(() => ({ select: insertSelectMock }));
const maybeSingleMock = vi.fn();
const fromMock = vi.fn();

vi.mock('@/lib/cateringOrderEmail', () => ({
  sendCateringOrderEmail: (...args: unknown[]) => sendEmailMock(...args),
}));

vi.mock('@/lib/supabaseServer', () => ({
  supabaseServer: {
    from: (table: string) => fromMock(table),
  },
}));

beforeEach(() => {
  fromMock.mockImplementation((table: string) => {
    if (table === 'catering_orders') {
      return { insert: insertMock };
    }
    if (table === 'store') {
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: maybeSingleMock,
          }),
        }),
      };
    }
    throw new Error(`Unexpected table ${table}`);
  });

  insertSingleMock.mockResolvedValue({ data: { id: 'order-1' }, error: null });
  maybeSingleMock.mockResolvedValue({
    data: { name: 'Hotlob Test', email: 'store@example.com' },
    error: null,
  });

  sendEmailMock.mockClear();
  fromMock.mockClear();
});

describe('catering orders route', () => {
  it('returns 400 when required fields are missing', async () => {
    const request = new Request('http://localhost/api/catering-orders', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('stores the order and sends an email when store email exists', async () => {
    const request = new Request('http://localhost/api/catering-orders', {
      method: 'POST',
      body: JSON.stringify({
        storeId: 'store-1',
        cateringDate: '2026-02-20',
        pickupTime: '10:00',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '0412 345 678',
        submittedAt: '18/02/2026, 2:14 pm (Australia/Perth)',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
  });

  it('stores the order without emailing when store email is missing', async () => {
    maybeSingleMock.mockResolvedValueOnce({
      data: { name: 'Hotlob Test', email: '' },
      error: null,
    });

    const request = new Request('http://localhost/api/catering-orders', {
      method: 'POST',
      body: JSON.stringify({
        storeId: 'store-1',
        cateringDate: '2026-02-20',
        pickupTime: '10:00',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '0412 345 678',
        submittedAt: '18/02/2026, 2:14 pm (Australia/Perth)',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
