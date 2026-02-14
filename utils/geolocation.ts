export async function tryGetQuickLocation(options?: { timeoutMs?: number }): Promise<{ lat: number; lon: number } | null> {
  const timeoutMs = options?.timeoutMs ?? 2000

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return null
  }

  return new Promise((resolve) => {
    let settled = false
    const onSuccess = (pos: GeolocationPosition) => {
      if (settled) return
      settled = true
      resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude })
    }

    const onError = () => {
      if (settled) return
      settled = true
      resolve(null)
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      timeout: timeoutMs,
      maximumAge: 0
    })

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      // Cannot reliably cancel a `getCurrentPosition` across browsers.
      // Just resolve null and let the original callbacks be ignored via `settled` guard.
      resolve(null)
    }, timeoutMs + 50)

    // Cleanup when resolved
    ;(async () => {
      await new Promise((r) => setTimeout(r, 0))
      clearTimeout(timer)
    })()
  })
}

export default tryGetQuickLocation
