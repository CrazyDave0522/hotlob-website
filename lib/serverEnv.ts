// lib/serverEnv.ts
// Server-only env accessors (do not import in client components)

export function getGMapsApiKey(): string {
  const key = process.env.GMAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("Missing GMAPS_API_KEY in environment");
  }
  return key;
}

export function getCronSecret(): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    throw new Error("Missing CRON_SECRET in environment");
  }
  return secret;
}
