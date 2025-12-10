import React from 'react'
// Keep the canonical TTL in `lib/constants.ts` for reference, but Next's
// App Router requires segment config exports (like `revalidate`) to be
// literal values. Export a numeric literal here so the router can validate.
export const revalidate = 86400 // CONSTANTS.REVALIDATE_OUR_LOCATIONS

export default function OurLocationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
