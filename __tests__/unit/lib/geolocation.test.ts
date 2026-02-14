import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tryGetQuickLocation } from '../../../utils/geolocation'

type MockNavigator = {
  geolocation: {
    getCurrentPosition: (
      success: PositionCallback,
      error?: PositionErrorCallback,
      options?: PositionOptions
    ) => number | void
  }
}

describe('tryGetQuickLocation', () => {
  beforeEach(() => {
    ;(global as unknown as { navigator?: MockNavigator }).navigator = undefined
  })

  it('returns null when navigator.geolocation is unavailable', async () => {
    ;(global as unknown as { navigator?: MockNavigator }).navigator = undefined
    const res = await tryGetQuickLocation({ timeoutMs: 10 })
    expect(res).toBeNull()
  })

  it('resolves with coordinates on success', async () => {
    const mockGetCurrentPosition: MockNavigator['geolocation']['getCurrentPosition'] = vi.fn((success) => {
      const pos = { coords: { latitude: 1.23, longitude: 4.56 } } as unknown as GeolocationPosition
      success(pos)
      return 1
    })

    ;(global as unknown as { navigator?: MockNavigator }).navigator = { geolocation: { getCurrentPosition: mockGetCurrentPosition } }

    const res = await tryGetQuickLocation({ timeoutMs: 50 })
    expect(res).toEqual({ lat: 1.23, lon: 4.56 })
  })

  it('returns null on error', async () => {
    const mockGetCurrentPosition: MockNavigator['geolocation']['getCurrentPosition'] = vi.fn((_, error) => {
      const err = { code: 1 } as unknown as GeolocationPositionError
      error?.(err)
      return 1
    })

    ;(global as unknown as { navigator?: MockNavigator }).navigator = { geolocation: { getCurrentPosition: mockGetCurrentPosition } }

    const res = await tryGetQuickLocation({ timeoutMs: 50 })
    expect(res).toBeNull()
  })
})
