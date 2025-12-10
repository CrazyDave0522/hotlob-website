import React from 'react'
// Keep the canonical TTL in `lib/constants.ts` for reference, but Next's
// App Router requires segment config exports (like `revalidate`) to be
// literal values. Export a numeric literal here so the router can validate.
export const revalidate = 300 // CONSTANTS.REVALIDATE_SEE_OUR_FOOD

export default function SeeOurFoodLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
