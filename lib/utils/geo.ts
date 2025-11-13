// lib/utils/geo.ts

/**
 * Calculate spherical distance between two points (unit: meters)
 * @param lat1 Latitude 1
 * @param lng1 Longitude 1
 * @param lat2 Latitude 2
 * @param lng2 Longitude 2
 */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Get user geolocation with timeout (default 5 seconds)
 * @param timeoutMs Timeout in milliseconds
 */
export function getCurrentPositionWithTimeout(timeoutMs = 5000): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Location request timeout'));
        }, timeoutMs);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(timeoutId);
                resolve(pos);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
}
